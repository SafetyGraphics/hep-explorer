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

    if (!Array.prototype.find) {
        Object.defineProperty(Array.prototype, 'find', {
            value: function value(predicate) {
                // 1. Let O be ? ToObject(this value).
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }

                var o = Object(this);

                // 2. Let len be ? ToLength(? Get(O, 'length')).
                var len = o.length >>> 0;

                // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }

                // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                var thisArg = arguments[1];

                // 5. Let k be 0.
                var k = 0;

                // 6. Repeat, while k < len
                while (k < len) {
                    // a. Let Pk be ! ToString(k).
                    // b. Let kValue be ? Get(O, Pk).
                    // c. Let testResult be ToBoolean(? Call(predicate, T, � kValue, k, O �)).
                    // d. If testResult is true, return kValue.
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return kValue;
                    }
                    // e. Increase k by 1.
                    k++;
                }

                // 7. Return undefined.
                return undefined;
            }
        });
    }

    // https://github.com/wbkd/d3-extended
    d3.selection.prototype.moveToFront = function() {
        return this.each(function() {
            this.parentNode.appendChild(this);
        });
    };

    d3.selection.prototype.moveToBack = function() {
        return this.each(function() {
            var firstChild = this.parentNode.firstChild;
            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    };

    var defaultSettings = {
        //Default template settings
        value_col: 'STRESN',
        measure_col: 'TEST',
        visit_col: 'VISIT',
        visitn_col: 'VISITN',
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
        group_cols: null,
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
            format: '.1f',
            domain: [0, null]
        },
        y: {
            column: 'TB_relative',
            label: 'TB (% ULN)',
            type: 'linear',
            behavior: 'flex',
            format: '.1f',
            domain: [0, null]
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
        color_by: null, //set in syncSettings
        max_width: 500,
        aspect: 1
    };

    //Replicate settings in multiple places in the settings object
    function syncSettings(settings) {
        settings.marks[0].per[0] = settings.id_col;

        //set grouping config
        if (!(settings.group_cols instanceof Array && settings.group_cols.length)) {
            settings.group_cols = [{ value_col: 'NONE', label: 'None' }];
        } else {
            settings.group_cols = settings.group_cols.map(function(group) {
                return {
                    value_col: group.value_col || group,
                    label: group.label || group.value_col || group
                };
            });

            var hasNone =
                settings.group_cols
                    .map(function(m) {
                        return m.value_col;
                    })
                    .indexOf('NONE') > -1;
            if (!hasNone) {
                settings.group_cols.unshift({ value_col: 'NONE', label: 'None' });
            }
        }

        if (settings.group_cols.length > 1) {
            settings.color_by = settings.group_cols[1].value_col
                ? settings.group_cols[1].value_col
                : settings.group_cols[1];
        }

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
                type: 'dropdown',
                label: 'Group',
                description: 'Grouping Variable',
                options: ['color_by'],
                start: null, // set in syncControlInputs()
                values: ['NONE'], // set in syncControlInputs()
                require: true
            },
            {
                type: 'number',
                label: 'ALT Cutpoint',
                description: 'X-axis cut',
                option: 'quadrants.cut_data.x'
            },
            {
                type: 'number',
                label: 'TB Cutpoint',
                description: 'Y-axis cut',
                option: 'quadrants.cut_data.y'
            }
        ];

        //Sync group control.
        var groupControl = defaultControls.filter(function(controlInput) {
            return controlInput.label === 'Group';
        })[0];
        groupControl.start = settings.color_by;
        settings.group_cols
            .filter(function(group) {
                return group.value_col !== 'NONE';
            })
            .forEach(function(group) {
                groupControl.values.push(group.value_col);
            });

        //Add custom filters to control inputs.
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
        var chart = this;
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

                //Add participant level metadata
                var filterVars = chart.config.filters.map(function(d) {
                    return d.value_col;
                });
                var groupVars = chart.config.group_cols.map(function(d) {
                    return d.value_col;
                });
                var varList = d3$1.merge([filterVars, groupVars]);

                varList.forEach(function(v) {
                    participant_obj[v] = d[0][v];
                });

                return participant_obj;
            })
            .entries(sub);
        console.log(flat_data);
        var flat_data = flat_data.map(function(m) {
            m.values[config.id_col] = m.key;

            //link the raw data to the flattened object
            var allMatches = chart.initial_data.filter(function(f) {
                return f[config.id_col] == m.key;
            });
            m.values.raw = allMatches;

            return m.values;
        });
        return flat_data;
    }

    function onInit() {
        this.raw_data.forEach(function(d) {
            d.NONE = 'All Participants'; // placeholder variable for non-grouped comparisons
        });

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

    function init() {
        var chart = this;
        var config = chart.config;
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
    }

    function clearRugs(axis) {
        chart[axis + '_rug'].selectAll('*').remove();
    }

    function highlight(d, chart) {
        //clear rugs if any
        clearRugs.call(chart, 'x');
        clearRugs.call(chart, 'y');

        //reset point stroke
        chart.marks[0].circles.attr('stroke-width', 1);

        //highlight points in the quadrant
        d3.select(this).attr('fill', 'black');
        var matches = chart.marks[0].circles.filter(function(f) {
            return f.values.raw[0].eDISH_quadrant == d.dataValue;
        });
        matches.attr('stroke-width', 2);
    }

    function clearHighlight(chart) {
        d3.select(this).attr('fill', '#bbb');
        chart.marks[0].circles.attr('stroke-width', 1);
    }

    function layout() {
        var chart = this;
        var quadrants = this.config.quadrants;

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
                highlight.call(this, d, chart);
            })
            .on('mouseout', function() {
                clearHighlight.call(this, chart);
            });
    }

    function initQuadrants() {
        init.call(this);
        layout.call(this);
    }

    function initRugs() {
        //initialize a 'rug' on each axis to show the distribution for a participant on addPointMouseover
        this.x_rug = this.svg.append('g').attr('class', 'rug x');
        this.y_rug = this.svg.append('g').attr('class', 'rug y');
    }

    function initVisitPath() {
        //initialize a 'rug' on each axis to show the distribution for a participant on addPointMouseover
        this.visitPath = this.svg.append('g').attr('class', 'visit-path');
    }

    function initMeasureTable() {
        var settings = {
            cols: ['key', 'n', 'min', 'median', 'max', 'spark'],
            headers: ['Measure', 'N', 'Min', 'Median', 'Max', ''],
            searchable: true,
            sortable: true,
            pagination: false,
            exportable: true,
            visitn_col: this.visitn_col,
            value_col: this.value_col
        };
        this.measureTable = webcharts.createTable(this.element, settings);
        this.measureTable.init([]);
        this.measureTable.wrap.selectAll('*').style('display', 'none');
    }

    function onLayout() {
        initQuadrants.call(this);
        initRugs.call(this);
        initVisitPath.call(this);
        initMeasureTable.call(this);
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
            quad.count = chart.filtered_data.filter(function(d) {
                return d.eDISH_quadrant == quad.dataValue;
            }).length;
            quad.total = chart.filtered_data.length;
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

    //draw marginal rug for visit-level measures
    function drawRugs(d, axis) {
        var chart = this;
        var config = this.config;

        //get matching measures
        var allMatches = d.values.raw[0].raw,
            measure = config.measure_details.find(function(f) {
                return config[axis].column.search(f.label) > -1;
            }).measure,
            matches = allMatches.filter(function(f) {
                return f[config.measure_col] == measure;
            });

        //draw the rug
        var min_value = axis == 'x' ? chart.y.domain()[0] : chart.x.domain()[0];
        chart[axis + '_rug']
            .selectAll('text')
            .data(matches)
            .enter()
            .append('text')
            .attr('class', 'rug-tick')
            .attr('x', function(d) {
                return axis == 'x'
                    ? config.display == 'relative'
                        ? chart.x(d.relative)
                        : chart.x(d[config.measure_col])
                    : chart.x(min_value);
            })
            .attr('y', function(d) {
                return axis == 'y'
                    ? config.display == 'relative'
                        ? chart.y(d.relative)
                        : chart.y(d[config.measure_col])
                    : chart.y(min_value);
            })
            //        .attr('dy', axis == 'x' ? '-0.2em' : null)
            .attr('text-anchor', axis == 'y' ? 'end' : null)
            .attr('alignment-baseline', axis == 'x' ? 'hanging' : null)
            .attr('font-size', axis == 'x' ? '6px' : null)
            .attr('stroke', function(d) {
                return chart.colorScale(d[config.color_by]);
            })
            .text(function(d) {
                return axis == 'x' ? '|' : '–';
            })
            .append('svg:title')
            .text(function(d) {
                return (
                    d[config.measure_col] +
                    '=' +
                    d3.format('.2f')(d[config.value_col]) +
                    ' (' +
                    d3.format('.2f')(d.relative) +
                    ' xULN) @ ' +
                    d[config.visit_col]
                );
            });
    }

    function addPointMouseover() {
        var chart = this;
        var points = this.marks[0].circles;
        //add event listener to all participant level points
        points
            .filter(function(d) {
                var disabled = d3.select(this).classed('disabled');
                return !disabled;
            })
            .on('mouseover', function(d) {
                //disable mouseover when highlights (onClick) are visible
                var disabled = d3.select(this).classed('disabled');
                if (!disabled) {
                    //clear previous mouseover if any
                    points.attr('stroke-width', 1);
                    clearRugs.call(chart, 'x');
                    clearRugs.call(chart, 'y');

                    //draw the rugs
                    d3.select(this).attr('stroke-width', 3);
                    drawRugs.call(chart, d, 'x');
                    drawRugs.call(chart, d, 'y');
                }
            });
    }

    function clearVisitPath(d) {
        this.visitPath.selectAll('*').remove();
    }

    function clearParticipantDetails(d) {
        var chart = this;
        var config = this.config;
        var points = this.marks[0].circles;

        points
            .attr('stroke', function(d) {
                return chart.colorScale(d[config.color_by]);
            }) //reset point colors
            .attr('stroke-width', 1); //reset stroke

        clearVisitPath.call(this, d); //remove path

        //remove the detail table
    }

    function drawVisitPath(d) {
        var chart = this;
        var config = chart.config;

        var allMatches = d.values.raw[0].raw,
            x_measure = config.measure_details.find(function(f) {
                return config.x.column.search(f.label) > -1;
            }).measure,
            y_measure = config.measure_details.find(function(f) {
                return config.y.column.search(f.label) > -1;
            }).measure,
            matches = allMatches.filter(function(f) {
                return f[config.measure_col] == x_measure || f[config.measure_col] == y_measure;
            });
        console.log(allMatches);

        //get coordinates by visit
        var visits = d3
            .set(
                matches.map(function(m) {
                    return m[config.visitn_col];
                })
            )
            .values();
        var visit_data = visits
            .map(function(m) {
                var visitObj = {};
                visitObj.visitn = +m;
                visitObj.visit = matches.filter(function(f) {
                    return f[config.visitn_col] == m;
                })[0][config.visit_col];
                visitObj[config.color_by] = matches[0][config.color_by];
                //get x coordinate
                var x_match = matches
                    .filter(function(f) {
                        return f[config.visitn_col] == m;
                    })
                    .filter(function(f) {
                        return f[config.measure_col] == x_measure;
                    })[0];
                visitObj.x =
                    config.display == 'relative' ? x_match.relative : x_match[config.value_col];

                //get y coordinate
                var y_match = matches
                    .filter(function(f) {
                        return f[config.visitn_col] == m;
                    })
                    .filter(function(f) {
                        return f[config.measure_col] == y_measure;
                    })[0];

                visitObj.y =
                    config.display == 'relative' ? y_match.relative : y_match[config.value_col];

                return visitObj;
            })
            .sort(function(a, b) {
                return a.visitn - b.visitn;
            });

        //draw the path
        var myLine = d3.svg
            .line()
            .x(function(d) {
                return chart.x(d.x);
            })
            .y(function(d) {
                return chart.y(d.y);
            });

        chart.visitPath.selectAll('*').remove();
        chart.visitPath.moveToFront();
        chart.visitPath
            .append('path')
            .attr('class', 'participant-visits')
            .datum(visit_data)
            .attr('d', myLine)
            .attr('stroke', '#ccc')
            .attr('stroke-width', '1px')
            .attr('fill', 'none');

        //draw visit points
        var visitPoints = chart.visitPath
            .selectAll('g.visit-point')
            .data(visit_data)
            .enter()
            .append('g')
            .attr('class', 'visit-point');

        var maxPoint = d;
        visitPoints
            .append('circle')
            .attr('class', 'participant-visits')
            .attr('fill', 'white')
            .attr('stroke', function(d) {
                return chart.colorScale(d[config.color_by]);
            })
            .attr('stroke-width', function(d) {
                return (d.x == maxPoint.x) & (d.y == maxPoint.y) ? 3 : 1;
            })
            .attr('cx', function(d) {
                return chart.x(d.x);
            })
            .attr('cy', function(d) {
                return chart.y(d.y);
            })
            .attr('r', 6);

        //draw visit numbers
        visitPoints
            .append('text')
            .text(function(d) {
                return d.visitn;
            })
            .attr('class', 'participant-visits')
            .attr('stroke', 'none')
            .attr('fill', function(d) {
                return chart.colorScale(d[config.color_by]);
            })
            .attr('x', function(d) {
                return chart.x(d.x);
            })
            .attr('y', function(d) {
                return chart.y(d.y);
            })
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('font-size', 8);
    }

    function addSparkLines(d) {
        console.log(d);
        console.log(this);

        this.tbody.selectAll('tr').each(function(row_d) {
            //Spark line cell
            var cell = d3
                    .select(this)
                    .select('td.spark')
                    .text(''),
                width = 100,
                height = 25,
                offset = 4,
                overTime = row_d.spark_data.sort(function(a, b) {
                    return +a.visitn - +b.visitn;
                }),
                x = d3.scale
                    .ordinal()
                    .domain(
                        overTime.map(function(m) {
                            return m.visitn;
                        })
                    )
                    .rangePoints([offset, width - offset]),
                y = d3.scale
                    .linear()
                    .domain(
                        d3.extent(overTime, function(d) {
                            return d.value;
                        })
                    )
                    .range([height - offset, offset]),
                line = d3.svg
                    .line()
                    .interpolate('cardinal')
                    .x(function(d) {
                        return x(d.visitn);
                    })
                    .y(function(d) {
                        return y(d.value);
                    }),
                svg = cell
                    .append('svg')
                    .attr({
                        width: width,
                        height: height
                    })
                    .append('g'),
                sparkLine = svg
                    .append('path')
                    .datum(overTime)
                    .attr({
                        class: 'sparkLine',
                        d: line,
                        fill: 'none',
                        stroke: '#bbb'
                    }),
                minimumData = overTime.filter(function(di) {
                    return (
                        di.value ===
                        d3.min(
                            overTime.map(function(dii) {
                                return dii.value;
                            })
                        )
                    );
                })[0],
                minimumMonth = svg.append('circle').attr({
                    class: 'circle minimum',
                    cx: x(minimumData.visitn),
                    cy: y(minimumData.value),
                    r: '2px',
                    stroke: 'blue',
                    fill: 'none'
                }),
                maximumData = overTime.filter(function(di) {
                    return (
                        di.value ===
                        d3.max(
                            overTime.map(function(dii) {
                                return dii.value;
                            })
                        )
                    );
                })[0],
                maximumMonth = svg.append('circle').attr({
                    class: 'circle maximum',
                    cx: x(maximumData.visitn),
                    cy: y(maximumData.value),
                    r: '2px',
                    stroke: 'orange',
                    fill: 'none'
                });
        });
    }

    function drawMeasureTable(d) {
        var chart = this;
        var config = chart.config;
        var allMatches = d.values.raw[0].raw;

        //make nest by measure
        var nested = d3
            .nest()
            .key(function(d) {
                return d[config.measure_col];
            })
            .rollup(function(d) {
                var measureObj = {};
                measureObj.raw = d;
                measureObj.values = d.map(function(d) {
                    return +d[config.value_col];
                });
                measureObj.max = +d3.format('0.2f')(d3.max(measureObj.values));
                measureObj.min = +d3.format('0.2f')(d3.min(measureObj.values));
                measureObj.median = +d3.format('0.2f')(d3.median(measureObj.values));
                measureObj.n = measureObj.values.length;
                measureObj.spark = 'spark!';
                measureObj.spark_data = d.map(function(m) {
                    return {
                        visitn: +m[config.visitn_col],
                        value: +m[config.value_col]
                    };
                });

                return measureObj;
            })
            .entries(allMatches);

        var nested = nested.map(function(m) {
            m.values.key = m.key;
            return m.values;
        });
        console.log(nested);

        //draw the measure table
        this.measureTable.wrap.selectAll('*').style('display', null);
        this.measureTable.on('draw', addSparkLines);
        this.measureTable.draw(nested);
    }

    function addPointClick() {
        var chart = this;
        var config = this.config;
        var points = this.marks[0].circles;

        //add event listener to all participant level points
        points.on('click', function(d) {
            clearParticipantDetails.call(chart, d); //clear the previous participant
            points
                .attr('stroke', '#ccc') //set all points to gray
                .classed('disabled', true); //disable mouseover while viewing participant details

            d3
                .select(this)
                .attr('stroke', function(d) {
                    return chart.colorScale(d.values.raw[0][config.color_by]);
                }) //highlight selected point
                .attr('stroke-width', 3);

            drawVisitPath.call(chart, d); //draw the path showing participant's pattern over time
            drawMeasureTable.call(chart, d); //draw table showing measure values with sparklines

            //add clear details button
        });
    }

    function onResize() {
        drawQuadrants.call(this);
        addPointMouseover.call(this);
        addPointClick.call(this);
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
        chart.element = element;

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
