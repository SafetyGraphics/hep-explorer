(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory(require('webcharts')))
        : typeof define === 'function' && define.amd
            ? define(['webcharts'], factory)
            : (global.safetyedish = factory(global.webCharts));
})(this, function(webcharts) {
    'use strict';

    if (typeof Object.assign != 'function') {
        (function() {
            Object.assign = function(target) {
                'use strict';

                if (target === undefined || target === null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                var output = Object(target);
                for (var index = 1; index < arguments.length; index++) {
                    var source = arguments[index];
                    if (source !== undefined && source !== null) {
                        for (var nextKey in source) {
                            if (source.hasOwnProperty(nextKey)) {
                                output[nextKey] = source[nextKey];
                            }
                        }
                    }
                }
                return output;
            };
        })();
    }

    var defaultSettings = {
        //Default template settings
        value_col: 'STRESN',
        measure_col: 'TEST',
        measure_details: [
            {
                label: 'ALT',
                measure: 'Aminotransferase, alanine (ALT)',
                cut: {
                    relative: 3,
                    absolute: null
                }
            },
            {
                label: 'ALP',
                measure: 'Alkaline phosphatase (ALP)',
                cut: {
                    relative: 2,
                    absolute: null
                }
            },
            {
                label: 'TB',
                measure: 'Total Bilirubin',
                cut: {
                    relative: 2,
                    absolute: null
                }
            }
        ],
        unit_col: 'STRESU',
        normal_range: true,
        normal_col_low: 'STNRLO',
        normal_col_high: 'STNRHI',
        id_col: 'USUBJID',
        group_col: null,
        filters: null,
        details: null,
        missingValues: ['', 'NA', 'N/A'],
        display: 'relative', //or "absolute"

        //Standard webcharts settings
        x: {
            column: 'ALT_relative',
            label: null,
            type: 'linear',
            behavior: 'flex',
            format: '.1f'
        },
        y: {
            column: 'TB_relative',
            label: null,
            type: 'linear',
            behavior: 'flex'
        },
        marks: [
            {
                per: [], // set in syncSettings()
                type: 'circle',
                summarizeY: 'mean',
                summarizeX: 'mean',
                attributes: { 'fill-opacity': 0.75 }
            }
        ],
        aspect: 1
    };

    //Replicate settings in multiple places in the settings object
    function syncSettings(settings) {
        settings.marks[0].per[0] = settings.id_col;

        //Define default details.
        var defaultDetails = [{ value_col: settings.id_col, label: 'Subject Identifier' }];
        if (settings.filters)
            settings.filters.forEach(function(filter) {
                return defaultDetails.push({
                    value_col: filter.value_col ? filter.value_col : filter,
                    label: filter.label
                        ? filter.label
                        : filter.value_col ? filter.value_col : filter
                });
            });
        defaultDetails.push({ value_col: settings.value_col, label: 'Result' });
        if (settings.normal_col_low)
            defaultDetails.push({
                value_col: settings.normal_col_low,
                label: 'Lower Limit of Normal'
            });
        if (settings.normal_col_high)
            defaultDetails.push({
                value_col: settings.normal_col_high,
                label: 'Upper Limit of Normal'
            });

        //If [settings.details] is not specified:
        if (!settings.details) settings.details = defaultDetails;
        else {
            //If [settings.details] is specified:
            //Allow user to specify an array of columns or an array of objects with a column property
            //and optionally a column label.
            settings.details.forEach(function(detail) {
                if (
                    defaultDetails
                        .map(function(d) {
                            return d.value_col;
                        })
                        .indexOf(detail.value_col ? detail.value_col : detail) === -1
                )
                    defaultDetails.push({
                        value_col: detail.value_col ? detail.value_col : detail,
                        label: detail.label
                            ? detail.label
                            : detail.value_col ? detail.value_col : detail
                    });
            });
            settings.details = defaultDetails;
        }

        return settings;
    }

    //Map values from settings to control inputs
    function syncControlInputs(settings) {
        var defaultControls = [];

        if (settings.filters && settings.filters.length > 0) {
            var otherFilters = settings.filters.map(function(filter) {
                filter = {
                    type: 'subsetter',
                    value_col: filter.value_col ? filter.value_col : filter,
                    label: filter.label
                        ? filter.label
                        : filter.value_col ? filter.value_col : filter
                };
                return filter;
            });
            return defaultControls.concat(otherFilters);
        } else return defaultControls;
    }

    function flattenData() {
        var config = this.config;
        //make a data set with one row per ID

        //filter the lab data to only the required measures
        var included_measures = config.measure_details.map(function(m) {
            return m.measure;
        });

        var sub = this.initial_data
            .filter(function(f) {
                return included_measures.indexOf(f[config.measure_col]) > -1;
            })
            .filter(function(f) {
                return true;
            }); //add a filter on selected visits here

        //get the relative value (% of the upper limit of normal) for the measure
        sub.forEach(function(d) {
            d.relative = d[config.value_col] / d[config.normal_col_high];
        });

        //get maximum values for each measure type
        var flat_data = d3
            .nest()
            .key(function(f) {
                return f[config.id_col];
            })
            .rollup(function(d) {
                var participant_obj = {};
                config.measure_details.forEach(function(m) {
                    var matches = d.filter(function(f) {
                        return m.measure == f[config.measure_col];
                    }); //get matching measures

                    //get max raw value
                    participant_obj[m.label + '_absolute'] = d3.max(matches, function(d) {
                        return d[config.value_col];
                    });
                    participant_obj[m.label + '_absolute_flagged'] =
                        participant_obj[m.label + '_absolute'] > m.cut.absolute;

                    //get max relative value and flagged status
                    participant_obj[m.label + '_relative'] = d3.max(matches, function(d) {
                        return d.relative;
                    });
                    participant_obj[m.label + '_relative_flagged'] =
                        participant_obj[m.label + '_relative'] > m.cut.relative;
                });
                return participant_obj;
            })
            .entries(sub);

        var flat_data = flat_data.map(function(m) {
            m.values[config.id_col] = m.key;
            return m.values;
        });
        console.log(flat_data);
        return flat_data;
    }

    function onInit() {
        this.raw_data = flattenData.call(this);
    }

    function onLayout() {}

    function onPreprocess() {
        console.log(this);
        this.raw_data = flattenData.call(this);
    }

    function onDataTransform() {}

    function onDraw() {}

    function onResize() {}

    function safetyedish(element, settings) {
        var mergedSettings = Object.assign({}, defaultSettings, settings),
            syncedSettings = syncSettings(mergedSettings),
            syncedControlInputs = syncControlInputs(syncedSettings),
            controls = webcharts.createControls(element, {
                location: 'top',
                inputs: syncedControlInputs
            }),
            chart = webcharts.createChart(element, syncedSettings, controls);

        /*
        listingSettings = {
            cols: syncedSettings.details.map(detail => detail.value_col),
            headers: syncedSettings.details.map(detail => detail.label),
            searchable: syncedSettings.searchable,
            sortable: syncedSettings.sortable,
            pagination: syncedSettings.pagination,
            exportable: syncedSettings.exportable
        };
     chart.listing = createTable(element, listingSettings);
    chart.listing.init([]);
    chart.listing.wrap.selectAll('*').style('display', 'none');
    */

        //Define callbacks.
        chart.on('init', onInit);
        chart.on('layout', onLayout);
        chart.on('preprocess', onPreprocess);
        chart.on('datatransform', onDataTransform);
        chart.on('draw', onDraw);
        chart.on('resize', onResize);

        return chart;
    }

    return safetyedish;
});
