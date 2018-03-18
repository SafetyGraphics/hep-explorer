(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory(require('webcharts'), require('d3')))
        : typeof define === 'function' && define.amd
            ? define(['webcharts', 'd3'], factory)
            : (global.safetyedish = factory(global.webCharts, global.d3));
})(this, function(webcharts, d3$1) {
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
                    relative: 1,
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
            label: 'ALT (% ULN)',
            type: 'linear',
            behavior: 'flex',
            format: '.1f'
        },
        y: {
            column: 'TB_relative',
            label: 'TB (% ULN)',
            type: 'linear',
            behavior: 'flex',
            format: '.1f'
        },
        marks: [
            {
                per: [], // set in syncSettings()
                type: 'circle',
                summarizeY: 'mean',
                summarizeX: 'mean',
                attributes: { 'fill-opacity': 0 }
            }
        ],
        color_by: 'ALP_relative_flagged',
        max_width: 500,
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
        var defaultControls = [
            {
                type: 'number',
                label: 'ALT Cutpoint',
                option: 'quadrants.cut_data.x'
            },
            {
                type: 'number',
                label: 'TB Cutpoint',
                option: 'quadrants.cut_data.y'
            }
        ];

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

    //Converts a one record per measure data object to a one record per participant objects

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

        return flat_data;
    }

    function onInit() {
        this.raw_data = flattenData.call(this);
    }

    var defaultCutData = [
        {
            dimension: 'x',
            value: null
        },
        {
            dimension: 'y',
            value: null
        }
    ];

    var defaultQuadrantData = [
        {
            label: "Possible Hy's Law Range",
            position: 'upper-right',
            dataValue: 'xHigh:yHigh',
            count: null,
            total: null,
            percent: null
        },
        {
            label: 'Hyperbilirubinemia',
            position: 'upper-left',
            dataValue: 'xNormal:yHigh',
            count: null,
            total: null,
            percent: null
        },
        {
            label: "Temple's Corollary",
            position: 'lower-right',
            dataValue: 'xHigh:yNormal',
            count: null,
            total: null,
            percent: null
        },
        {
            label: 'Normal Range',
            position: 'lower-left',
            dataValue: 'xNormal:yNormal',
            count: null,
            total: null,
            percent: null
        }
    ];

    function initQuadrants() {
        var chart = this;
        var config = chart.config;

        //layout the quadrants for hy's law risk levels
        this.config.quadrants = {};
        var quadrants = this.config.quadrants;

        //////////////////////////////////////////////////////////
        //create custom data objects for the lines and quadrants
        /////////////////////////////////////////////////////////
        quadrants.quadrant_data = defaultQuadrantData;

        quadrants.cut_data = defaultCutData;
        quadrants.cut_data.x = null; //Also store the cuts as properties for convenience
        quadrants.cut_data.y = null;

        ///////////////////////////////////////////////////////////
        // set initial values
        //////////////////////////////////////////////////////////
        quadrants.cut_data.x = config.measure_details.find(function(f) {
            return config.x.column.search(f.label) > -1;
        }).cut[config.display];

        chart.controls.wrap
            .selectAll('div.control-group')
            .filter(function(f) {
                return f.option == 'quadrants.cut_data.x';
            })
            .select('input')
            .node().value =
            quadrants.cut_data.x;

        quadrants.cut_data.y = config.measure_details.find(function(f) {
            return config.y.column.search(f.label) > -1;
        }).cut[config.display];

        chart.controls.wrap
            .selectAll('div.control-group')
            .filter(function(f) {
                return f.option == 'quadrants.cut_data.y';
            })
            .select('input')
            .node().value =
            quadrants.cut_data.y;

        //////////////////////////////////////////////////////////
        //layout the cut lines
        /////////////////////////////////////////////////////////
        quadrants.wrap = this.svg.append('g').attr('class', 'quadrants');
        var wrap = quadrants.wrap;

        quadrants.cut_g = wrap
            .selectAll('g.cut')
            .data(quadrants.cut_data)
            .enter()
            .append('g')
            .attr('class', function(d) {
                return 'cut ' + d.dimension;
            });

        quadrants.cut_lines = quadrants.cut_g
            .append('line')
            .attr('class', 'cut-line')
            .attr('dash-array', '5,5')
            .attr('stroke', '#bbb');

        quadrants.cut_labels = quadrants.cut_g
            .append('text')
            .attr('class', 'cut-label')
            .attr('stroke', '#bbb');

        //////////////////////////////////////////////////////////
        //layout the quadrant labels
        /////////////////////////////////////////////////////////
        quadrants.group_labels = this.svg.append('g').attr('class', 'group-labels');

        quadrants.group_labels
            .selectAll('text.quadrant-label')
            .data(quadrants.quadrant_data)
            .enter()
            .append('text')
            .attr('class', function(d) {
                return 'quadrant-label ' + d.position;
            })
            .attr('dy', function(d) {
                return d.position.search('lower') > -1 ? '-.2em' : '.2em';
            })
            .attr('dx', function(d) {
                return d.position.search('right') > -1 ? '-.5em' : '.5em';
            })
            .attr('text-anchor', function(d) {
                return d.position.search('right') > 0 ? 'end' : null;
            })
            .attr('fill', '#bbb')
            .style('cursor', 'pointer')
            .text(function(d) {
                return d.label;
            })
            .on('mouseover', function(d) {
                d3.select(this).attr('fill', 'black');
                var matches = chart.marks[0].circles.filter(function(f) {
                    return f.values.raw[0].eDISH_quadrant == d.dataValue;
                });
                matches.attr('stroke-width', 2);
            })
            .on('mouseout', function() {
                d3.select(this).attr('fill', '#bbb');
                chart.marks[0].circles.attr('stroke-width', 1);
            });
    }

    function onLayout() {
        console.log(this);
        initQuadrants.call(this);
    }

    function onPreprocess() {
        //update flattened data
        this.raw_data = flattenData.call(this);
    }

    function onDataTransform() {}

    function updateQuadrantData() {
        var chart = this;
        var config = this.config;

        //update cut data
        var dimensions = ['x', 'y'];
        dimensions.forEach(function(dimension) {
            //get value linked to the controls ...
            var cut = config.quadrants.cut_data[dimension];
            console.log(cut);

            // ... add propogate it elsewhere
            config.measure_details //
                .find(function(f) {
                    return config[dimension].column.search(f.label) > -1;
                }).cut[config.display] = cut;
            config.quadrants.cut_data.filter(function(f) {
                return f.dimension == dimension;
            })[0].value = cut;
        });

        //add "eDISH_quadrant" column to raw_data
        var x_var = this.config.x.column;
        var y_var = this.config.y.column;
        this.raw_data.forEach(function(d) {
            var x_cat = d[x_var] >= config.quadrants.cut_data.x ? 'xHigh' : 'xNormal';
            var y_cat = d[y_var] >= config.quadrants.cut_data.y ? 'yHigh' : 'yNormal';
            d['eDISH_quadrant'] = x_cat + ':' + y_cat;
        });

        //update Quadrant data
        config.quadrants.quadrant_data.forEach(function(quad) {
            quad.count = chart.raw_data.filter(function(d) {
                return d.eDISH_quadrant == quad.dataValue;
            }).length;
            quad.total = chart.raw_data.length;
            quad.percent = d3.format('0.1%')(quad.count / quad.total);
        });
    }

    function setDomain(dimension) {
        var _this = this;

        var domain = this[dimension].domain();
        var cut = this.config.measure_details.find(function(f) {
            return _this.config[dimension].column.search(f.label) > -1;
        }).cut[this.config.display];

        if (cut * 1.01 >= domain[1]) {
            domain[1] = cut * 1.01;
        }

        //note: probably don't want this lower-bound calucation long term (use 0-ish value instead?)
        if (cut * 0.99 <= domain[0]) {
            domain[0] = cut * 0.99;
        }

        this[dimension + '_dom'] = domain;
    }

    function onDraw() {
        //get current cutpoints and classify participants in to eDISH quadrants
        updateQuadrantData.call(this);

        //update domains to include cut lines
        setDomain.call(this, 'x');
        setDomain.call(this, 'y');
    }

    function drawQuadrants() {
        var _this = this;

        //position for cut-point lines
        this.config.quadrants.cut_lines
            .filter(function(d) {
                return d.dimension == 'x';
            })
            .attr('x1', function(d) {
                return _this.x(d.value);
            })
            .attr('x2', function(d) {
                return _this.x(d.value);
            })
            .attr('y1', this.plot_height)
            .attr('y2', 0);

        this.config.quadrants.cut_lines
            .filter(function(d) {
                return d.dimension == 'y';
            })
            .attr('x1', 0)
            .attr('x2', this.plot_width)
            .attr('y1', function(d) {
                return _this.y(d.value);
            })
            .attr('y2', function(d) {
                return _this.y(d.value);
            });

        //position labels
        this.config.quadrants.group_labels
            .select('text.upper-right')
            .attr('x', this.plot_width)
            .attr('y', 0);

        this.config.quadrants.group_labels
            .select('text.upper-left')
            .attr('x', 0)
            .attr('y', 0);

        this.config.quadrants.group_labels
            .select('text.lower-right')
            .attr('x', this.plot_width)
            .attr('y', this.plot_height);

        this.config.quadrants.group_labels
            .select('text.lower-left')
            .attr('x', 0)
            .attr('y', this.plot_height);

        this.config.quadrants.group_labels
            .selectAll('text')
            .attr('display', function(d) {
                return d.count == 0 ? 'none' : null;
            })
            .text(function(d) {
                return d.label + ' (' + d.percent + ')';
            });
    }

    function onResize() {
        console.log(this);
        drawQuadrants.call(this);
    }

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
