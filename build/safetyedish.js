(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('webcharts')) :
	typeof define === 'function' && define.amd ? define(['webcharts'], factory) :
	(global.safetyedish = factory(global.webCharts));
}(this, (function (webcharts) { 'use strict';

if (typeof Object.assign != 'function') {
    Object.defineProperty(Object, 'assign', {
        value: function assign(target, varArgs) {
            // .length of function is 2
            'use strict';

            if (target == null) {
                // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) {
                    // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }

            return to;
        },
        writable: true,
        configurable: true
    });
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

if (!Array.prototype.findIndex) {
    Object.defineProperty(Array.prototype, 'findIndex', {
        value: function value(predicate) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
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
                // d. If testResult is true, return k.
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return k;
                }
                // e. Increase k by 1.
                k++;
            }

            // 7. Return -1.
            return -1;
        }
    });
}

// https://github.com/wbkd/d3-extended
d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};

d3.selection.prototype.moveToBack = function () {
    return this.each(function () {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

/*------------------------------------------------------------------------------------------------\
  Clone a variable (http://stackoverflow.com/a/728694).
\------------------------------------------------------------------------------------------------*/

function clone(obj) {
    var copy;

    //Handle the 3 simple types, and null or undefined
    if (null == obj || 'object' != (typeof obj === "undefined" ? "undefined" : _typeof(obj))) return obj;

    //Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    //Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    //Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

function renderer() {
    return {
        value_col: 'STRESN',
        measure_col: 'TEST',
        visit_col: 'VISIT',
        visitn_col: 'VISITNUM',
        studyday_col: 'DY',
        unit_col: 'STRESU',
        normal_col_low: 'STNRLO',
        normal_col_high: 'STNRHI',
        id_col: 'USUBJID',
        group_cols: null,
        filters: null,
        details: null,
        r_ratio: 0,
        visit_level_points: true,
        measure_details: [{
            label: 'ALT',
            measure: 'Aminotransferase, alanine (ALT)',
            axis: 'x',
            imputation: 'data-driven',
            cut: {
                relative_baseline: 3.8,
                relative_uln: 3,
                absolute: 1.0
            }
        }, {
            label: 'AST',
            measure: 'Aminotransferase, aspartate (AST)',
            axis: 'x',
            imputation: 'data-driven',
            cut: {
                relative_baseline: 3.8,
                relative_uln: 3,
                absolute: 1.0
            }
        }, {
            label: 'TB',
            measure: 'Total Bilirubin',
            axis: 'y',
            imputation: 'data-driven',
            cut: {
                relative_baseline: 4.8,
                relative_uln: 2,
                absolute: 40
            }
        }, {
            label: 'ALP',
            measure: 'Alkaline phosphatase (ALP)',
            axis: 'z',
            imputation: 'data-driven',
            cut: {
                relative_baseline: 3.8,
                relative_uln: 1,
                absolute: 1.0
            }
        }],
        missingValues: ['', 'NA', 'N/A'],
        axis_options: [{ label: 'Upper limit of normal adjusted (eDish)', value: 'relative_uln' }, { label: 'Baseline adjusted (mDish)', value: 'relative_baseline' }, { label: 'Raw Values', value: 'absolute' }],
        display: 'relative_uln', //or "relative_baseline" or "absolute"
        baseline_visitn: '1',
        measureBounds: [0.01, 0.99],
        populationProfileURL: null,
        participantProfileURL: null,
        point_size: 'Uniform',
        visit_window: 30,
        showTitle: true
    };
}

function webcharts$1() {
    return {
        x: {
            column: null, //set in onPreprocess/updateAxisSettings
            label: null, // set in onPreprocess/updateAxisSettings,
            type: 'linear',
            behavior: 'raw',
            format: '.2f'
            //domain: [0, null]
        },
        y: {
            column: null, // set in onPreprocess/updateAxisSettings,
            label: null, // set in onPreprocess/updateAxisSettings,
            type: 'linear',
            behavior: 'raw',
            format: '.2f'
            //domain: [0, null]
        },
        marks: [{
            per: [], // set in syncSettings()
            type: 'circle',
            summarizeX: 'mean',
            summarizeY: 'mean',
            attributes: {
                'fill-opacity': 0,
                'stroke-width': 1.5
            }
        }, {
            per: [], // set in syncSettings()
            type: 'circle',
            summarizeX: 'mean',
            summarizeY: 'mean',
            attributes: {
                'fill-opacity': .1,
                'stroke-width': .5
            },
            radius: 1
        }],
        gridlines: 'xy',
        color_by: null, //set in syncSettings
        max_width: 600,
        aspect: 1,
        legend: { location: 'top' },
        margin: { right: 25, top: 25, bottom: 75 }
    };
}

function settings() {
    return Object.assign({}, renderer(), webcharts$1());
}

//Replicate settings in multiple places in the settings object
function syncSettings(settings) {
    settings.marks[0].per[0] = settings.id_col;
    settings.marks[1].per[0] = settings.id_col;
    settings.marks[1].per[1] = settings.visit_col;

    //set grouping config
    if (!(settings.group_cols instanceof Array && settings.group_cols.length)) {
        settings.group_cols = [{ value_col: 'NONE', label: 'None' }];
    } else {
        settings.group_cols = settings.group_cols.map(function (group) {
            return {
                value_col: group.value_col || group,
                label: group.label || group.value_col || group
            };
        });

        var hasNone = settings.group_cols.map(function (m) {
            return m.value_col;
        }).indexOf('NONE') > -1;
        if (!hasNone) {
            settings.group_cols.unshift({ value_col: 'NONE', label: 'None' });
        }
    }

    if (settings.group_cols.length > 1) {
        settings.color_by = settings.group_cols[1].value_col ? settings.group_cols[1].value_col : settings.group_cols[1];
    } else {
        settings.color_by = 'NONE';
    }

    //Define default details.
    var defaultDetails = [{ value_col: settings.id_col, label: 'Subject Identifier' }];
    if (settings.filters) {
        settings.filters.forEach(function (filter) {
            var obj = {
                value_col: filter.value_col ? filter.value_col : filter,
                label: filter.label ? filter.label : filter.value_col ? filter.value_col : filter
            };

            if (defaultDetails.find(function (f) {
                return f.value_col == obj.value_col;
            }) == undefined) {
                defaultDetails.push(obj);
            }
        });
    }

    if (settings.group_cols) {
        settings.group_cols.filter(function (f) {
            return f.value_col != 'NONE';
        }).forEach(function (group) {
            var obj = {
                value_col: group.value_col ? group.value_col : filter,
                label: group.label ? group.label : group.value_col ? group.value_col : filter
            };
            if (defaultDetails.find(function (f) {
                return f.value_col == obj.value_col;
            }) == undefined) {
                defaultDetails.push(obj);
            }
        });
    }

    //If [settings.details] is not specified:
    if (!settings.details) settings.details = defaultDetails;else {
        //If [settings.details] is specified:
        //Allow user to specify an array of columns or an array of objects with a column property
        //and optionally a column label.
        settings.details.forEach(function (detail) {
            if (defaultDetails.map(function (d) {
                return d.value_col;
            }).indexOf(detail.value_col ? detail.value_col : detail) === -1) defaultDetails.push({
                value_col: detail.value_col ? detail.value_col : detail,
                label: detail.label ? detail.label : detail.value_col ? detail.value_col : detail
            });
        });
        settings.details = defaultDetails;
    }

    //Attach measure details to axis settings.
    settings.x.measure_detail = settings.measure_details.find(function (measure_detail) {
        return measure_detail.axis === 'x';
    });
    settings.x.column = settings.x.measure_detail.label;
    settings.y.measure_detail = settings.measure_details.find(function (measure_detail) {
        return measure_detail.axis === 'y';
    });
    settings.y.column = settings.y.measure_detail.label;

    return settings;
}

function controlInputs() {
    return [{
        type: 'dropdown',
        label: 'Group',
        description: 'Grouping variable',
        options: ['color_by'],
        start: null, // set in syncControlInputs()
        values: ['NONE'], // set in syncControlInputs()
        require: true
    }, {
        type: 'dropdown',
        label: 'Display Type',
        description: 'Relative or absolute axes',
        options: ['displayLabel'],
        start: null, // set in syncControlInputs()
        values: null, // set in syncControlInputs()
        require: true
    }, {
        type: 'dropdown',
        label: 'X-axis Measure',
        description: null, // set in syncControlInputs()
        option: 'x.column',
        start: null, // set in syncControlInputs()
        values: null, //set in syncControlInptus()
        require: true
    }, {
        type: 'number',
        label: null, // set in syncControlInputs
        description: 'X-axis cut',
        option: 'quadrants.cut_data.x'
    }, {
        type: 'dropdown',
        label: 'Y-axis Measure',
        description: null, // set in syncControlInputs()
        option: 'y.column',
        start: null, // set in syncControlInputs()
        values: null, //set in syncControlInptus()
        require: true
    }, {
        type: 'number',
        label: null, // set in syncControlInputs
        description: 'Y-axis cut',
        option: 'quadrants.cut_data.y'
    }, {
        type: 'dropdown',
        label: 'Point Size',
        description: 'Parameter to set point radius',
        options: ['point_size'],
        start: 'None', // set in syncControlInputs()
        values: ['Uniform'],
        require: true
    }, {
        type: 'dropdown',
        label: 'Axis Type',
        description: 'Linear or log axes',
        options: ['x.type', 'y.type'],
        start: null, // set in syncControlInputs()
        values: ['linear', 'log'],
        require: true
    }, {
        type: 'number',
        label: 'Highlight Points Based on Timing',
        description: 'Fill points with max values less than X days apart',
        option: 'visit_window'
    }, {
        type: 'number',
        label: 'Minimum R Ratio',
        description: 'Display points with R ratios greater or equal to X',
        option: 'r_ratio'
    }, {
        type: 'checkbox',
        label: 'Visit-level Results',
        description: 'Display visit-level data points',
        option: 'visit_level_points'
    }];
}

//Map values from settings to control inputs
function syncControlInputs(controlInputs, settings) {
    //Sync group control.
    var groupControl = controlInputs.find(function (controlInput) {
        return controlInput.label === 'Group';
    });
    groupControl.start = settings.color_by;
    settings.group_cols.filter(function (group) {
        return group.value_col !== 'NONE';
    }).forEach(function (group) {
        groupControl.values.push(group.value_col);
    });

    //drop the group control if NONE is the only option
    if (settings.group_cols.length == 1) controlInputs = controlInputs.filter(function (controlInput) {
        return controlInput.label != 'Group';
    });

    //Sync x-axis measure control.
    var xAxisMeasures = settings.measure_details.filter(function (measure_detail) {
        return measure_detail.axis === 'x';
    });

    if (xAxisMeasures.length === 1) controlInputs = controlInputs.filter(function (controlInput) {
        return controlInput.option !== 'x.column';
    });else {
        var xAxisMeasureControl = controlInputs.find(function (controlInput) {
            return controlInput.option === 'x.column';
        });
        xAxisMeasureControl.description = xAxisMeasures.map(function (xAxisMeasure) {
            return xAxisMeasure.label;
        }).join(', ');
        xAxisMeasureControl.start = xAxisMeasures[0].label;
        xAxisMeasureControl.values = xAxisMeasures.map(function (xAxisMeasure) {
            return xAxisMeasure.label;
        });
    }

    //Sync x-axis cut control.
    controlInputs.find(function (controlInput) {
        return controlInput.option === 'quadrants.cut_data.x';
    }).label = xAxisMeasures[0].label + ' Cutpoint';

    //Sync y-axis measure control.
    var yAxisMeasures = settings.measure_details.filter(function (measure_detail) {
        return measure_detail.axis === 'y';
    });

    if (yAxisMeasures.length === 1) controlInputs = controlInputs.filter(function (controlInput) {
        return controlInput.option !== 'y.column';
    });else {
        var yAxisMeasureControl = controlInputs.find(function (controlInput) {
            return controlInput.option === 'y.column';
        });
        yAxisMeasureControl.description = yAxisMeasures.map(function (yAxisMeasure) {
            return yAxisMeasure.label;
        }).join(', ');
        yAxisMeasureControl.start = yAxisMeasures[0].label;
        yAxisMeasureControl.values = yAxisMeasures.map(function (yAxisMeasure) {
            return yAxisMeasure.label;
        });
    }

    //Sync y-axis cut control.
    controlInputs.find(function (controlInput) {
        return controlInput.option === 'quadrants.cut_data.y';
    }).label = yAxisMeasures[0].label + ' Cutpoint';

    //Sync point size control.
    var pointSizeControl = controlInputs.find(function (controlInput) {
        return controlInput.label === 'Point Size';
    });
    settings.measure_details.filter(function (f) {
        return f.axis != 'x' && f.axis != 'y';
    }).forEach(function (group) {
        pointSizeControl.values.push(group.label);
    });

    //drop the pointSize control if NONE is the only option
    if (settings.measure_details.length == 2) controlInputs = controlInputs.filter(function (controlInput) {
        return controlInput.label != 'Point Size';
    });

    //Sync display control
    controlInputs.find(function (controlInput) {
        return controlInput.label === 'Display Type';
    }).values = settings.axis_options.map(function (m) {
        return m.label;
    });

    //Add custom filters to control inputs.
    if (settings.filters && settings.filters.length > 0) {
        var otherFilters = settings.filters.map(function (filter) {
            filter = {
                type: 'subsetter',
                value_col: filter.value_col ? filter.value_col : filter,
                label: filter.label ? filter.label : filter.value_col ? filter.value_col : filter
            };
            return filter;
        });
        return controlInputs.concat(otherFilters);
    } else return controlInputs;
}

var configuration = {
    settings: settings,
    syncSettings: syncSettings,
    controlInputs: controlInputs,
    syncControlInputs: syncControlInputs
};

function checkMeasureDetails() {
    var _this = this;

    this.measures = d3.set(this.raw_data.map(function (d) {
        return d[_this.config.measure_col];
    })).values().sort();
    var specifiedMeasures = this.config.measure_details.map(function (measure_detail) {
        return measure_detail.measure;
    });
    this.config.measure_details = this.config.measure_details.filter(function (measure) {
        return _this.measures.indexOf(measure) < 0;
    });
    var missingMeasures = specifiedMeasures.filter(function (measure) {
        return _this.config.measure_details.map(function (measure_detail) {
            return measure_detail.measure;
        }).indexOf(measure) < 0;
    });
    var nMeasuresRemoved = missingMeasures.length;
    if (nMeasuresRemoved > 0) alert('The data are missing ' + (nMeasuresRemoved === 1 ? 'this measure' : 'these measures') + ': ' + missingMeasures.join(', ') + '.');
}

function checkRequiredVariables() {
    var _this = this;

    this.varList = [];
    if (this.config.filters) {
        var filterVars = this.config.filters.map(function (d) {
            return d.hasOwnProperty('value_col') ? d.value_col : d;
        });
        this.varList = d3.merge([this.varList, filterVars]);
    }
    if (this.config.group_cols) {
        var groupVars = this.config.group_cols.map(function (d) {
            return d.hasOwnProperty('value_col') ? d.value_col : d;
        });
        this.varList = d3.merge([this.varList, groupVars]);
    }
    if (this.config.details) {
        var detailVars = this.config.details.map(function (d) {
            return d.hasOwnProperty('value_col') ? d.value_col : d;
        }).filter(function (detail) {
            return (detail.value_col || detail) !== _this.config.id_col;
        });
        this.varList = d3.merge([this.varList, detailVars]);
    }
    var missingVariables = this.varList.filter(function (variable) {
        return Object.keys(_this.raw_data[0]).indexOf(variable) < 0;
    });
    if (missingVariables.length > 0) alert('The data are missing ' + (missingVariables.length === 1 ? 'this variable' : 'these variables') + ': ' + missingVariables.join(', ') + '.');
}

function iterateOverData() {
    var _this = this;

    this.raw_data.forEach(function (d) {
        d[_this.config.x.column] = null; // placeholder variable for x-axis
        d[_this.config.y.column] = null; // placeholder variable for y-axis
        d.NONE = 'All Participants'; // placeholder variable for non-grouped comparisons

        //Remove space characters from result variable.
        if (typeof d[_this.config.value_col] == 'string') d[_this.config.value_col] = d[_this.config.value_col].replace(/\s/g, ''); // remove space characters
    });
}

function addRRatioFilter() {
    this.filters.push({
        col: 'rRatioFlag',
        val: 'Y',
        choices: ['Y', 'N'],
        loose: undefined
    });
}

function onInit() {
    checkMeasureDetails.call(this);
    iterateOverData.call(this);
    checkRequiredVariables.call(this);
    addRRatioFilter.call(this);
}

function updateMarkValues() {
    this.config.marks[0].values = {
        level: ['participant']
    };
    this.config.marks[1].values = {
        level: ['visit']
    };
}

function setCutpointMinimums() {
    var chart = this;

    this.controls.wrap.selectAll('.control-group').filter(function (d) {
        return (/.-axis cut/i.test(d.description)
        );
    }).attr('min', 0).on('change', function (d) {
        var input = d3.select(this).select('input');

        //Prevent a negative input.
        if (input.property('value') < 0) input.property('value', 0);

        //Update chart setting.
        chart.config.quadrants.cut_data[d.description.split('-')[0].toLowerCase()] = input.property('value');

        //Redraw.
        chart.draw();
    });
}

function addRRatioSpan() {
    var rRatioLabel = this.controls.wrap.selectAll('.control-group').filter(function (d) {
        return d.option === 'r_ratio';
    }).select('.wc-control-label');
    rRatioLabel.html(rRatioLabel.html() + ' (<span id = \'r-ratio\'></span>)');
}

var defaultCutData = [{
    dimension: 'x',
    value: null
}, {
    dimension: 'y',
    value: null
}];

var defaultQuadrantData = [{
    label: "Possible Hy's Law Range",
    position: 'upper-right',
    dataValue: 'xHigh:yHigh',
    count: null,
    total: null,
    percent: null
}, {
    label: 'Hyperbilirubinemia',
    position: 'upper-left',
    dataValue: 'xNormal:yHigh',
    count: null,
    total: null,
    percent: null
}, {
    label: "Temple's Corollary",
    position: 'lower-right',
    dataValue: 'xHigh:yNormal',
    count: null,
    total: null,
    percent: null
}, {
    label: 'Normal Range',
    position: 'lower-left',
    dataValue: 'xNormal:yNormal',
    count: null,
    total: null,
    percent: null
}];

function updateSummaryTable() {
    var quadrants = this.config.quadrants;
    var rows = quadrants.table.rows;
    var cells = quadrants.table.cells;

    function updateCells(d) {
        var cellData = cells.map(function (cell) {
            cell.value = d[cell.value_col];
            return cell;
        });
        var row_cells = d3.select(this).selectAll('td').data(cellData, function (d) {
            return d.value_col;
        });

        row_cells.enter().append('td').style('text-align', function (d, i) {
            return d.label != 'Quadrant' ? 'center' : null;
        }).style('font-size', '0.9em').style('padding', '0 0.5em 0 0.5em');

        row_cells.html(function (d) {
            return d.value;
        });
    }

    //update the content of each row
    rows.data(quadrants.quadrant_data, function (d) {
        return d.label;
    });
    rows.each(updateCells);
}

function initSummaryTable() {
    var chart = this;
    var config = chart.config;
    var quadrants = this.config.quadrants;

    quadrants.table = {};
    quadrants.table.wrap = this.wrap.append('div').attr('class', 'quadrantTable').style('padding-top', '1em');
    quadrants.table.tab = quadrants.table.wrap.append('table').style('border-collapse', 'collapse');

    //table header
    quadrants.table.cells = [{
        value_col: 'label',
        label: 'Quadrant'
    }, {
        value_col: 'count',
        label: '#'
    }, {
        value_col: 'percent',
        label: '%'
    }];

    if (config.populationProfileURL) {
        quadrants.quadrant_data.forEach(function (d) {
            d.link = "<a href='" + config.populationProfileURL + "'>&#128279</a>";
        });
        quadrants.table.cells.push({
            value_col: 'link',
            label: 'Population Profile'
        });
    }
    quadrants.table.thead = quadrants.table.tab.append('thead').style('border-top', '2px solid #999').style('border-bottom', '2px solid #999').append('tr').style('padding', '0.1em');

    quadrants.table.thead.selectAll('th').data(quadrants.table.cells).enter().append('th').html(function (d) {
        return d.label;
    });

    //table contents
    quadrants.table.tbody = quadrants.table.tab.append('tbody').style('border-bottom', '2px solid #999');
    quadrants.table.rows = quadrants.table.tbody.selectAll('tr').data(quadrants.quadrant_data, function (d) {
        return d.label;
    }).enter().append('tr').style('padding', '0.1em');

    //initial table update
    updateSummaryTable.call(this);
}

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
    quadrants.cut_data.x = config.x.measure_detail.cut[config.display];

    chart.controls.wrap.selectAll('div.control-group').filter(function (f) {
        return f.option == 'quadrants.cut_data.x';
    }).select('input').node().value = quadrants.cut_data.x;

    quadrants.cut_data.y = config.y.measure_detail.cut[config.display];

    chart.controls.wrap.selectAll('div.control-group').filter(function (f) {
        return f.option == 'quadrants.cut_data.y';
    }).select('input').node().value = quadrants.cut_data.y;

    ///////////////////////////////////////////////////////////
    // initialize the summary table
    //////////////////////////////////////////////////////////
    initSummaryTable.call(chart);
}

function layout() {
    var chart = this;
    var quadrants = this.config.quadrants;

    //////////////////////////////////////////////////////////
    //layout the cut lines
    /////////////////////////////////////////////////////////
    quadrants.wrap = this.svg.append('g').attr('class', 'quadrants');
    var wrap = quadrants.wrap;

    //slight hack to make life easier on drag
    quadrants.cut_data.forEach(function (d) {
        d.chart = chart;
    });

    quadrants.cut_g = wrap.selectAll('g.cut').data(quadrants.cut_data).enter().append('g').attr('class', function (d) {
        return 'cut ' + d.dimension;
    });

    quadrants.cut_lines = quadrants.cut_g.append('line').attr('class', 'cut-line').attr('stroke-dasharray', '5,5').attr('stroke', '#bbb');

    quadrants.cut_lines_backing = quadrants.cut_g.append('line').attr('class', 'cut-line-backing').attr('stroke', 'transparent').attr('stroke-width', '10').attr('cursor', 'move');

    /* maybe not needed
    quadrants.cut_labels = quadrants.cut_g
        .append('text')
        .attr('class', 'cut-label')
        .attr('stroke', '#bbb');
    */
    //////////////////////////////////////////////////////////
    //layout the quadrant labels
    /////////////////////////////////////////////////////////

    quadrants.group_labels = this.svg.append('g').attr('class', 'group-labels');

    quadrants.group_labels.selectAll('text.quadrant-label').data(quadrants.quadrant_data).enter().append('text').attr('class', function (d) {
        return 'quadrant-label ' + d.position;
    }).attr('dy', function (d) {
        return d.position.search('lower') > -1 ? '-.2em' : '.5em';
    }).attr('dx', function (d) {
        return d.position.search('right') > -1 ? '-.5em' : '.5em';
    }).attr('text-anchor', function (d) {
        return d.position.search('right') > 0 ? 'end' : null;
    }).attr('fill', '#bbb')
    //  .style('cursor', 'pointer')
    .text(function (d) {
        return d.label;
    });

    //removing the interactivity for now, but could add it back in later if desired
    /*
          .on('mouseover', function(d) {
            highlight.call(this, d, chart);
        })
        .on('mouseout', function() {
            clearHighlight.call(this, chart);
        });
        */
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

function initParticipantDetails() {
    //layout participant details section
    this.participantDetails = {};
    this.participantDetails.wrap = this.wrap.append('div').attr('class', 'participantDetails');

    this.participantDetails.header = this.participantDetails.wrap.append('div').attr('class', 'participantHeader');
    var splot = this.participantDetails.wrap.append('div').attr('class', 'spaghettiPlot');
    splot.append('h3').attr('class', 'id').html('Lab Values vs. Upper Limit of Normal by Visit').style('border-top', '2px solid black').style('border-bottom', '2px solid black').style('padding', '.2em');

    var mtable = this.participantDetails.wrap.append('div').attr('class', 'measureTable');
    mtable.append('h3').attr('class', 'id').html('Lab Summary Table').style('border-top', '2px solid black').style('border-bottom', '2px solid black').style('padding', '.2em');

    //initialize the measureTable
    var settings = {
        cols: ['key', 'n', 'min', 'median', 'max', 'spark'],
        headers: ['Measure', 'N', 'Min', 'Median', 'Max', ''],
        searchable: false,
        sortable: false,
        pagination: false,
        exportable: false,
        applyCSS: true,
        visitn_col: this.visitn_col,
        value_col: this.value_col
    };

    this.measureTable = webcharts.createTable(this.element + ' .participantDetails .measureTable', settings);
    this.measureTable.init([]);

    //hide the section until needed
    this.participantDetails.wrap.selectAll('*').style('display', 'none');
}

function initResetButton() {
    var chart = this;

    this.controls.reset = {};
    var reset = this.controls.reset;
    reset.wrap = this.controls.wrap.append('div').attr('class', 'control-group');
    reset.label = reset.wrap.append('span').attr('class', 'wc-control-label').text('Reset Chart');
    reset.button = reset.wrap.append('button').text('Reset').on('click', function () {
        var initial_container = chart.element;
        var initial_settings = chart.initial_settings;
        var initial_data = chart.initial_data;

        chart.destroy();
        chart = null;

        var newChart = safetyedish(initial_container, initial_settings);
        newChart.init(initial_data);
    });
}

function initDisplayControlLabels() {
    var chart = this;
    var config = this.config;
    var displayControlWrap = this.controls.wrap.selectAll('div').filter(function (controlInput) {
        return controlInput.label === 'Display Type';
    });

    var displayControl = displayControlWrap.select('select');

    //set the start value
    var start_value = config.axis_options.find(function (f) {
        return f.value == config.display;
    }).label;
    displayControl.selectAll('option').attr('selected', function (d) {
        return d == start_value ? 'selected' : null;
    });

    //annotation of baseline visit (only visible when mDish is selected)
    displayControlWrap.append('span').attr('class', 'displayControlAnnotation span-description').style('color', 'blue').text('Note: Baseline defined as Visit ' + chart.config.baseline_visitn).style('display', config.display == 'relative_baseline' ? null : 'none');

    displayControl.on('change', function (d) {
        var currentLabel = this.value;
        var currentValue = config.axis_options.find(function (f) {
            return f.label == currentLabel;
        }).value;
        config.display = currentValue;
        config.quadrants.cut_data.displayChange = currentValue;

        if (currentValue == 'relative_baseline') {
            displayControlWrap.select('span.displayControlAnnotation').style('display', null);
        } else {
            displayControlWrap.select('span.displayControlAnnotation').style('display', 'none');
        }

        chart.draw();
    });
}

function layoutPanels() {
    this.wrap.style('display', 'inline-block').style('width', '75%');

    this.controls.wrap.style('display', 'inline-block').style('width', '25%').style('vertical-align', 'top');

    this.controls.wrap.selectAll('div.control-group').style('display', 'block');
    this.controls.wrap.selectAll('div.control-group').select('select').style('width', '200px');
}

function initTitle() {
    if (this.config.showTitle) {
        this.titleDiv = this.controls.wrap.insert('div', '*').attr('class', 'title').style('border-top', '1px solid black').style('border-bottom', '1px solid black').style('margin-right', '1em').style('margin-bottom', '1em');

        this.titleDiv.append('span').text('Safety eDish').style('font-size', '1.5em').style('font-weight', 'strong').style('display', 'block');

        this.titleDiv.append('span').text('Use controls to update chart or click a point to see participant details.').style('font-size', '0.8em');
    }
}

function onLayout() {
    updateMarkValues.call(this);
    setCutpointMinimums.call(this);
    addRRatioSpan.call(this);
    layoutPanels.call(this);
    initTitle.call(this);
    initQuadrants.call(this);
    initRugs.call(this);
    initVisitPath.call(this);
    initParticipantDetails.call(this);
    initResetButton.call(this);
    initDisplayControlLabels.call(this);
}

function updateAxisSettings() {
    var config = this.config;

    //note: doing this in preprocess so that we can (theoretically have a control to change the variable on each axis later on)
    var unit = config.display == 'relative_uln' ? ' (xULN)' : config.display == 'relative_baseline' ? ' (xBaseline)' : config.display == 'absolute' ? ' (raw values)' : null;

    //Update x-axis settings.
    config.x.measure_detail = config.measure_details.find(function (measure_detail) {
        return measure_detail.label === config.x.column;
    });
    config.x.label = config.x.measure_detail.measure + unit;

    //Update y-axis settings.
    config.y.measure_detail = config.measure_details.find(function (measure_detail) {
        return measure_detail.label === config.y.column;
    });
    config.y.label = config.y.measure_detail.measure + unit;
}

function updateControlCutpointLabels() {
    if (this.controls.config.inputs.find(function (input) {
        return input.option === 'quadrants.cut_data.x';
    })) this.controls.wrap.selectAll('.control-group').filter(function (d) {
        return d.option === 'quadrants.cut_data.x';
    }).select('.wc-control-label').text(this.config.x.column + ' Cutpoint');
    if (this.controls.config.inputs.find(function (input) {
        return input.option === 'quadrants.cut_data.y';
    })) this.controls.wrap.selectAll('.control-group').filter(function (d) {
        return d.option === 'quadrants.cut_data.y';
    }).select('.wc-control-label').text(this.config.y.column + ' Cutpoint');
}

function updateRRatioSpan() {
    this.controls.wrap.select('#r-ratio').text(this.config.x.measure_detail.label + 'xULN / ' + this.config.y.measure_detail.label + 'xULN');
}

function imputeColumn(data, measure_column, value_column, measure, llod, imputed_value, drop) {
    //returns a data set with imputed values (or drops records) for records at or below a lower threshold for a given measure
    //data = the data set for imputation
    //measure_column = the column with the text measure names
    //value_column = the column with the numeric values to be changed via imputation
    //measure = the measure to be imputed
    //llod = the lower limit of detection - values at or below the llod are imputed
    //imputed_value = value for imputed records
    //drop = boolean flag indicating whether values at or below the llod should be dropped (default = false)

    if (drop == undefined) drop = false;
    if (drop) {
        return data.filter(function (f) {
            dropFlag = d[measure_column] == measure && +d[value_column] <= 0;
            return !dropFlag;
        });
    } else {
        data.forEach(function (d) {
            if (d[measure_column] == measure && +d[value_column] < +llod && d[value_column] >= 0) {
                d.impute_flag = true;
                d[value_column + '_original'] = d[value_column];
                d[value_column] = imputed_value;
            }
        });

        var impute_count = d3.sum(data.filter(function (d) {
            return d[measure_column] === measure;
        }), function (f) {
            return f.impute_flag;
        });

        if (impute_count > 0) console.warn('' + impute_count + ' value(s) less than ' + llod + ' were imputed to ' + imputed_value + ' for ' + measure);
        return data;
    }
}

function iterateOverMeasureDetails() {
    var chart = this;
    var config = this.config;

    config.measure_details.forEach(function (measure_settings) {
        var values = chart.imputed_data.filter(function (f) {
            return f[config.measure_col] == measure_settings.measure;
        }).map(function (m) {
            return +m[config.value_col];
        }).sort(function (a, b) {
            return a - b;
        }),
            minValue = d3.min(values.filter(function (f) {
            return f > 0;
        })),
            //minimum value > 0
        llod = null,
            imputed_value = null,
            drop = null;

        if (measure_settings.imputation == 'data-driven') {
            llod = minValue;
            imputed_value = minValue / 2;
            drop = false;
        } else if (measure_settings.imputation == 'user-defined') {
            llod = measure_settings.imputation_value;
            imputed_value = measure_settings.imputation_value / 2;
            drop = false;
        } else if (measure_settings.imputation == 'drop') {
            llod = null;
            imputed_value = null;
            drop = true;
        }
        chart.imputed_data = imputeColumn(chart.imputed_data, config.measure_col, config.value_col, measure_settings.measure, llod, imputed_value, drop);

        var total_imputed = d3.sum(chart.raw_data, function (f) {
            return f.impute_flag ? 1 : 0;
        });
    });
}

function deriveVariables() {
    var config = this.config;

    //filter the lab data to only the required measures
    var included_measures = config.measure_details.map(function (m) {
        return m.measure;
    });

    var sub = this.imputed_data.filter(function (f) {
        return included_measures.indexOf(f[config.measure_col]) > -1;
    }).filter(function (f) {
        return true;
    }); //add a filter on selected visits here

    var missingBaseline = 0;
    this.imputed_data.forEach(function (d) {
        //coerce numeric values to number
        var numerics = ['value_col', 'visitn_col', 'normal_col_low', 'normal_col_high'];
        numerics.forEach(function (col) {
            d[config[col]] = +d[config[col]];
        });
        //standardize key variables
        d.key_measure = false;
        if (included_measures.indexOf(d[config.measure_col]) > -1) {
            d.key_measure = true;

            //map the raw value to a variable called 'absolute'
            d.absolute = d[config.value_col];

            //get the value relative to the ULN (% of the upper limit of normal) for the measure
            d.relative_uln = d[config.value_col] / d[config.normal_col_high];

            //get the value relative to baseline for the measure
            var baseline_record = sub.filter(function (f) {
                return d[config.id_col] == f[config.id_col];
            }).filter(function (f) {
                return d[config.measure_col] == f[config.measure_col];
            }).filter(function (f) {
                return f[config.visitn_col] == +config.baseline_visitn;
            });

            if (baseline_record.length > 0) {
                d.baseline_absolute = baseline_record[0][config.value_col];
                if (d.baseline_absolute > 0) {
                    d.relative_baseline = d.absolute / d.baseline_absolute;
                } else {
                    missingBaseline = missingBaseline + 1;
                    d.relative_baseline = null;
                }
            } else {
                missingBaseline = missingBaseline + 1;
                d.baseline_absolute = null;
                d.relative_baseline = null;
            }
        }
    });

    if (missingBaseline > 0) console.warn('No baseline value found for ' + missingBaseline + ' of ' + sub.length + ' records.');
}

function imputeData() {
    var _this = this;

    this.imputed_data = this.initial_data.filter(function (d) {
        return (/^-?(\d*\.?\d+|\d+\.?\d*)(E-?\d+)?$/.test(d[_this.config.value_col])
        );
    });
    this.imputed_data.forEach(function (d) {
        d.impute_flag = false;
    });

    iterateOverMeasureDetails.call(this);
    deriveVariables.call(this);
}

function addParticipantLevelMetadata(d, participant_obj) {
    this.varList.forEach(function (v) {
        participant_obj[v] = d[0][v];
        participant_obj.level = 'participant';
    });
}

function calculateRatios(d, participant_obj) {
    var _this = this;

    this.config.measure_details.forEach(function (d) {
        _this.config.measure_details.filter(function (di) {
            return di.measure !== d.measure;
        }).forEach(function (di) {
            participant_obj[d.label + '_relative_uln/' + di.label + '_relative_uln'] = participant_obj[d.label + '_relative_uln'] / participant_obj[di.label + '_relative_uln'];
        });
    });

    //R-ratio should be the ratio of ALT to ALP, i.e. the x-axis to the z-axis.
    participant_obj.rRatio = participant_obj[this.config.x.measure_detail.label + '_relative_uln/' + this.config.measure_details.find(function (measure_detail) {
        return measure_detail.axis === 'z';
    }).label + '_relative_uln'];

    //Define flag given r-ratio minimum.
    participant_obj.rRatioFlag = participant_obj.rRatio > this.config.r_ratio ? 'Y' : 'N';
}

function flattenData() {
    var chart = this;
    var config = this.config;

    //make a data set with one row per ID

    //get list of columns to flatten
    var colList = [];
    var measureCols = ['measure_col', 'value_col', 'visit_col', 'visitn_col', 'studyday_col', 'unit_col', 'normal_col_low', 'normal_col_high'];

    measureCols.forEach(function (d) {
        if (Array.isArray(d)) {
            d.forEach(function (di) {
                colList.push(di.hasOwnProperty('value_col') ? config[di.value_col] : config[di]);
            });
        } else {
            colList.push(d.hasOwnProperty('value_col') ? config[d.value_col] : config[d]);
        }
    });

    //merge in the absolute and relative values
    colList = d3.merge([colList, ['absolute', 'relative_uln', 'relative_baseline', 'baseline_raw']]);

    //get maximum values for each measure type
    var flat_data = d3.nest().key(function (f) {
        return f[config.id_col];
    }).rollup(function (d) {
        var participant_obj = {};
        participant_obj.days_x = null;
        participant_obj.days_y = null;
        config.measure_details.forEach(function (m) {
            //get all raw data for the current measure
            var matches = d.filter(function (f) {
                return m.measure == f[config.measure_col];
            }); //get matching measures

            if (matches.length == 0) {
                console.log('No matches found');
                participant_obj.drop_participant = true;
                return participant_obj;
            } else {
                participant_obj.drop_participant = false;
            }

            //get record with maximum value for the current display type
            participant_obj[m.label] = d3.max(matches, function (d) {
                return +d[config.display];
            });

            var maxRecord = matches.find(function (d) {
                return participant_obj[m.label] == +d[config.display];
            });
            //map all measure specific values
            colList.forEach(function (col) {
                participant_obj[m.label + '_' + col] = maxRecord[col];
            });

            //determine whether the value is above the specified threshold
            if (m.cut[config.display]) {
                config.show_quadrants = true;
                participant_obj[m.label + '_cut'] = m.cut[config.display];
                participant_obj[m.label + '_flagged'] = participant_obj[m.label] >= participant_obj[m.label + '_cut'];
            } else {
                config.show_quadrants = false;
                participant_obj[m.label + '_cut'] = null;
                participant_obj[m.label + '_flagged'] = null;
            }

            //save study days for each axis;
            if (m.axis == 'x') participant_obj.days_x = maxRecord[config.studyday_col];
            if (m.axis == 'y') participant_obj.days_y = maxRecord[config.studyday_col];
        });

        //Add participant level metadata
        addParticipantLevelMetadata.call(chart, d, participant_obj);

        //Calculate ratios between measures.
        calculateRatios.call(chart, d, participant_obj);

        //calculate the day difference between x and y
        participant_obj.day_diff = Math.abs(participant_obj.days_x - participant_obj.days_y);

        return participant_obj;
    }).entries(this.imputed_data.filter(function (f) {
        return f.key_measure;
    }));

    var flat_data = flat_data.filter(function (f) {
        return f.values.drop_participant == false;
    }).map(function (m) {
        m.values[config.id_col] = m.key;

        //link the raw data to the flattened object
        var allMatches = chart.imputed_data.filter(function (f) {
            return f[config.id_col] == m.key;
        });
        m.values.raw = allMatches;

        return m.values;
    });
    return flat_data;
}

function addVisitLevelData() {
    var _this = this;

    if (this.config.visit_level_points) {
        //Filter raw data on relevant measures and nest by participant and visit.
        var currentMeasureDetails = this.config.measure_details.filter(function (measure_detail) {
            return [_this.config.x.column, _this.config.y.column].indexOf(measure_detail.label) > -1 || measure_detail.axis === 'z';
        });
        var currentMeasures = currentMeasureDetails.map(function (measureDetail) {
            return measureDetail.measure;
        });
        var currentMeasureLabels = currentMeasureDetails.map(function (measureDetail) {
            return measureDetail.label;
        });
        var visitLevelData = d3.nest().key(function (d) {
            return d[_this.config.id_col] + '||' + d[_this.config.visit_col] + '||' + _this.varList.map(function (variable) {
                return d[variable];
            }).join('||');
        }).rollup(function (d) {
            var visit_obj = {};
            d.forEach(function (di) {
                visit_obj['' + currentMeasureLabels[currentMeasures.findIndex(function (measure) {
                    return measure === di[_this.config.measure_col];
                })]] = _this.config.display === 'relative_uln' ? di[_this.config.value_col] / di[_this.config.normal_col_high] : _this.config.display === 'relative_baseline' ? di[_this.config.value_col] / d.find(function (dii) {
                    return dii[_this.config.visitn_col] === _this.config.baseline_visitn;
                })[_this.config.value_col] : _this.config.display === 'absolute' ? di[_this.config.value_col] : null;
            });
            return visit_obj;
        }).entries(this.imputed_data.filter(function (d) {
            return currentMeasures.indexOf(d[_this.config.measure_col]) > -1;
        }));

        //Flatten nested data.
        visitLevelData.forEach(function (d) {
            //Parse nest key.
            var keys = d.key.split('||');
            d[_this.config.id_col] = keys[0];
            d[_this.config.visit_col] = keys[1];
            _this.varList.forEach(function (variable, i) {
                d[variable] = keys[i + 2];
            });
            delete d.key;

            //Un-nest nest values.
            Object.assign(d, d.values);
            d.rRatio = d[_this.config.x.column] / d[_this.config.measure_details.find(function (measure_detail) {
                return measure_detail.axis === 'z';
            }).label];
            d.rRatioFlag = d.rRatio > _this.config.r_ratio ? 'Y' : 'N';
            delete d.values;

            //Assign data level.
            d.level = 'visit';
        });

        this.raw_data = this.raw_data.concat(visitLevelData);
    }
}

function setLegendLabel() {
    //change the legend label to match the group variable
    //or hide legend if group = NONE
    this.config.legend.label = this.config.color_by !== 'NONE' ? this.config.group_cols[this.config.group_cols.map(function (group) {
        return group.value_col;
    }).indexOf(this.config.color_by)].label : '';
}

function dropMissingValues() {
    var config = this.config;
    //drop records with missing or invalid (negative) values
    var missing_count = d3.sum(this.raw_data, function (f) {
        return f[config.x.column] <= 0 || f[config.y.column] <= 0;
    });

    if (missing_count > 0) {
        this.wrap.append('span.footnote').text('Data not shown for ' + missing_count + ' participant(s) with invalid data. This could be due to negative or 0 lab values or to missing baseline values when viewing mDish.');

        this.raw_data = this.raw_data.filter(function (f) {
            return f[config.x.column] > 0 & f[config.y.column] > 0;
        });
    } else {
        this.wrap.select('span.footnote').remove();
    }
}

function onPreprocess() {
    updateAxisSettings.call(this); //update axis label based on display type
    updateControlCutpointLabels.call(this); //update cutpoint control labels given x- and y-axis variables
    updateRRatioSpan.call(this);
    imputeData.call(this); //clean up values < llod
    this.raw_data = flattenData.call(this); //update flattened data
    addVisitLevelData.call(this); // add visit-level data to plot
    setLegendLabel.call(this); //update legend label based on group variable
    dropMissingValues.call(this);
}

function onDataTransform() {}

function updateQuadrantData() {
    var chart = this;
    var config = this.config;

    //update cut data
    var dimensions = ['x', 'y'];
    dimensions.forEach(function (dimension) {
        //change to the stored cut point if the display changed
        if (config.quadrants.cut_data.displayChange) {
            config.quadrants.cut_data[dimension] = config[dimension].measure_detail.cut[config.display];
            chart.controls.wrap.selectAll('div.control-group').filter(function (f) {
                return f.option == 'quadrants.cut_data.' + dimension;
            }).select('input').node().value = config.quadrants.cut_data[dimension];
        }

        // get value linked to the controls (quadrant_cut_obj), add propogate it elsewhere
        var current_cut = config.quadrants.cut_data[dimension];
        config[dimension].measure_detail.cut[config.display] = current_cut;
        config.quadrants.cut_data.filter(function (f) {
            return f.dimension == dimension;
        })[0] = current_cut;
    });

    config.quadrants.cut_data.displayChange = false;

    //add "eDISH_quadrant" column to raw_data
    var x_var = this.config.x.column;
    var y_var = this.config.y.column;

    var participantData = this.raw_data.filter(function (d) {
        return d.level === 'participant';
    });
    participantData.forEach(function (d) {
        var x_cat = d[x_var] >= config.quadrants.cut_data.x ? 'xHigh' : 'xNormal';
        var y_cat = d[y_var] >= config.quadrants.cut_data.y ? 'yHigh' : 'yNormal';
        d['eDISH_quadrant'] = x_cat + ':' + y_cat;
    });

    //update Quadrant data
    config.quadrants.quadrant_data.forEach(function (quad) {
        quad.count = participantData.filter(function (d) {
            return d.eDISH_quadrant == quad.dataValue;
        }).length;
        quad.total = participantData.length;
        quad.percent = d3.format('0.1%')(quad.count / quad.total);
    });
}

function setDomain(dimension) {
    var config = this.config;
    var domain = this[dimension].domain();
    var cut = this.config[dimension].measure_detail.cut[this.config.display];

    //make sure the domain contains the cut point
    if (cut * 1.01 >= domain[1]) {
        domain[1] = cut * 1.01;
    }

    // make sure the domain lower limit captures all of the raw Values
    if (this.config[dimension].type == 'linear') {
        // just use the lower limit of 0 for continuous
        domain[0] = 0;
    } else if (this.config[dimension].type == 'log') {
        // use the smallest raw value for a log axis
        var measure = config[dimension].measure_detail['measure'];
        var values = this.imputed_data.filter(function (f) {
            return f[config.measure_col] == measure;
        }).map(function (m) {
            return +m[config.display];
        }).filter(function (m) {
            return m > 0;
        }).sort(function (a, b) {
            return a - b;
        });
        var minValue = d3.min(values);

        if (minValue < domain[0]) {
            domain[0] = minValue;
        }

        //throw a warning if the domain is > 0 if using log scale
        if (this[dimension].type == 'log' && domain[0] <= 0) {
            console.warn("Can't draw a log " + dimension + '-axis because there are values <= 0.');
        }
    }
    this[dimension + '_dom'] = domain;
}

function clearVisitPath() {
    this.visitPath.selectAll('*').remove();
}

function clearParticipantHeader() {
    this.participantDetails.header.selectAll('*').remove(); //clear participant header
}

function hideMeasureTable() {
    this.measureTable.draw([]);
    this.measureTable.wrap.selectAll('*').style('display', 'none');
}

function clearRugs(axis) {
    this[axis + '_rug'].selectAll('*').remove();
}

function formatPoints() {
    var chart = this;
    var config = this.config;
    var points = this.marks[0].circles;

    points.attr('stroke', function (d) {
        var disabled = d3.select(this).classed('disabled');
        var raw = d.values.raw[0],
            pointColor = chart.colorScale(raw[config.color_by]);
        return disabled ? '#ccc' : pointColor;
    }).attr('fill', function (d) {
        var disabled = d3.select(this).classed('disabled');
        var raw = d.values.raw[0],
            pointColor = chart.colorScale(raw[config.color_by]);
        return disabled ? 'white' : pointColor;
    }).attr('stroke-width', this.marks[0].attributes['stroke-width']);
}

function clearParticipantDetails() {
    var points = this.svg.selectAll('g.point').select('circle');

    points.classed('disabled', false);
    this.config.quadrants.table.wrap.style('display', null);
    clearVisitPath.call(this); //remove path
    clearParticipantHeader.call(this);
    clearRugs.call(this, 'x'); //clear rugs
    clearRugs.call(this, 'y');
    hideMeasureTable.call(this); //remove the detail table
    formatPoints.call(this);
    this.participantDetails.wrap.selectAll('*').style('display', 'none');
}

function onDraw() {
    //clear participant Details
    if (this.config.quadrants.table.wrap.style('display') === 'none') clearParticipantDetails.call(this);

    //get current cutpoints and classify participants in to eDISH quadrants
    updateQuadrantData.call(this);

    //update domains to include cut lines
    setDomain.call(this, 'x');
    setDomain.call(this, 'y');
}

//draw marginal rug for visit-level measures
function drawRugs(d, axis) {
    var chart = this;
    var config = this.config;

    //get matching measures
    var allMatches = d.values.raw[0].raw;
    var measure = config[axis].measure_detail.measure;
    var matches = allMatches.filter(function (f) {
        return f[config.measure_col] == measure;
    });

    //draw the rug
    var min_value = axis == 'x' ? chart.y.domain()[0] : chart.x.domain()[0];
    chart[axis + '_rug'].selectAll('text').data(matches).enter().append('text').attr('class', 'rug-tick').attr('x', function (d) {
        return axis == 'x' ? chart.x(d[config.display]) : chart.x(min_value);
    }).attr('y', function (d) {
        return axis == 'y' ? chart.y(d[config.display]) : chart.y(min_value);
    })
    //        .attr('dy', axis == 'x' ? '-0.2em' : null)
    .attr('text-anchor', axis == 'y' ? 'end' : null).attr('alignment-baseline', axis == 'x' ? 'hanging' : null).attr('font-size', axis == 'x' ? '6px' : null).attr('stroke', function (d) {
        return chart.colorScale(d[config.color_by]);
    }).text(function (d) {
        return axis == 'x' ? '|' : '–';
    }).append('svg:title').text(function (d) {
        return d[config.measure_col] + '=' + d3.format('.2f')(d.absolute) + ' (' + d3.format('.2f')(d.relative) + ' xULN) @ ' + d[config.visit_col];
    });
}

function addPointMouseover() {
    var chart = this;
    var points = this.marks[0].circles;

    //add event listener to all participant level points
    points.filter(function (d) {
        var disabled = d3.select(this).classed('disabled');
        return !disabled;
    }).on('mouseover', function (d) {
        //disable mouseover when highlights (onClick) are visible
        var disabled = d3.select(this).classed('disabled');
        if (!disabled) {
            //clear previous mouseover if any
            points.attr('stroke-width', chart.marks[0].attributes['stroke-width']);
            clearRugs.call(chart, 'x');
            clearRugs.call(chart, 'y');

            //draw the rugs
            d3.select(this).attr('stroke-width', 3);
            drawRugs.call(chart, d, 'x');
            drawRugs.call(chart, d, 'y');
        }
    });
}

function drawVisitPath(d) {
    var chart = this;
    var config = chart.config;

    var allMatches = d.values.raw[0].raw;
    var x_measure = config.x.measure_detail.measure;
    var y_measure = config.y.measure_detail.measure;
    var matches = allMatches.filter(function (f) {
        return f[config.measure_col] == x_measure || f[config.measure_col] == y_measure;
    });

    //get coordinates by visit
    var visits = d3.set(matches.map(function (m) {
        return m[config.visitn_col];
    })).values();
    var visit_data = visits.map(function (m) {
        var visitObj = {};
        visitObj.visitn = +m;
        visitObj.visit = matches.filter(function (f) {
            return f[config.visitn_col] == m;
        })[0][config.visit_col];
        visitObj[config.color_by] = matches[0][config.color_by];
        //get x coordinate
        var x_match = matches.filter(function (f) {
            return f[config.visitn_col] == m;
        }).filter(function (f) {
            return f[config.measure_col] == x_measure;
        });

        if (x_match.length) {
            visitObj.x = x_match[0][config.display];
            visitObj.xMatch = x_match[0];
        } else {
            visitObj.x = null;
            visitObj.xMatch = null;
        }

        //get y coordinate
        var y_match = matches.filter(function (f) {
            return f[config.visitn_col] == m;
        }).filter(function (f) {
            return f[config.measure_col] == y_measure;
        });
        if (y_match.length) {
            visitObj.y = y_match[0][config.display];
            visitObj.yMatch = y_match[0];
        } else {
            visitObj.y = null;
            visitObj.yMatch = null;
        }

        return visitObj;
    }).sort(function (a, b) {
        return a.visitn - b.visitn;
    }).filter(function (f) {
        return f.x > 0 & f.y > 0;
    });
    //draw the path
    var myLine = d3.svg.line().x(function (d) {
        return chart.x(d.x);
    }).y(function (d) {
        return chart.y(d.y);
    });

    chart.visitPath.selectAll('*').remove();
    chart.visitPath.moveToFront();

    var path = chart.visitPath.append('path').attr('class', 'participant-visits').datum(visit_data).attr('d', myLine).attr('stroke', function (d) {
        return chart.colorScale(matches[0][config.color_by]);
    }).attr('stroke-width', '2px').attr('fill', 'none');

    var totalLength = path.node().getTotalLength();

    path.attr('stroke-dasharray', totalLength + ' ' + totalLength).attr('stroke-dashoffset', totalLength).transition().duration(2000).ease('linear').attr('stroke-dashoffset', 0);

    //draw visit points
    var visitPoints = chart.visitPath.selectAll('g.visit-point').data(visit_data).enter().append('g').attr('class', 'visit-point');

    var maxPoint = d;
    visitPoints.append('circle').attr('class', 'participant-visits').attr('r', 0).attr('stroke', function (d) {
        return chart.colorScale(d[config.color_by]);
    }).attr('stroke-width', function (d) {
        return d.x == maxPoint.x & d.y == maxPoint.y ? 3 : 1;
    }).attr('cx', function (d) {
        return chart.x(d.x);
    }).attr('cy', function (d) {
        return chart.y(d.y);
    }).attr('fill', 'white').transition().delay(2000).duration(200).attr('r', 6);

    //draw visit numbers
    visitPoints.append('text').text(function (d) {
        return d.visitn;
    }).attr('class', 'participant-visits').attr('stroke', 'none').attr('fill', function (d) {
        return chart.colorScale(d[config.color_by]);
    }).attr('x', function (d) {
        return chart.x(d.x);
    }).attr('y', function (d) {
        return chart.y(d.y);
    }).attr('text-anchor', 'middle').attr('alignment-baseline', 'middle').attr('font-size', 0).transition().delay(2000).duration(200).attr('font-size', 8);
}

function addSparkLines(d) {
    if (this.data.raw.length > 0) {
        //don't try to draw sparklines if the table is empty
        this.tbody.selectAll('tr').style('background', 'none').style('border-bottom', '.5px solid black').each(function (row_d) {
            //Spark line cell
            var cell = d3.select(this).select('td.spark').text(''),
                width = 100,
                height = 25,
                offset = 4,
                overTime = row_d.spark_data.sort(function (a, b) {
                return +a.visitn - +b.visitn;
            });
            var x = d3.scale.ordinal().domain(overTime.map(function (m) {
                return m.visitn;
            })).rangePoints([offset, width - offset]);
            //y-domain includes 99th population percentile + any participant outliers
            var y_min = d3.min(d3.merge([row_d.values, row_d.population_extent])) * 0.99;
            var y_max = d3.max(d3.merge([row_d.values, row_d.population_extent])) * 1.01;
            var y = d3.scale.linear().domain([y_min, y_max]).range([height - offset, offset]);
            //render the svg
            var svg = cell.append('svg').attr({
                width: width,
                height: height
            }).append('g');

            //draw the normal range polygon ULN and LLN
            var upper = overTime.map(function (m) {
                return { visitn: m.visitn, value: m.uln };
            });
            var lower = overTime.map(function (m) {
                return { visitn: m.visitn, value: m.lln };
            }).reverse();
            var normal_data = d3.merge([upper, lower]);
            var drawnormal = d3.svg.line().x(function (d) {
                return x(d.visitn);
            }).y(function (d) {
                return y(d.value);
            });
            var normalpath = svg.append('path').datum(normal_data).attr({
                class: 'normalrange',
                d: drawnormal,
                fill: '#eee',
                stroke: 'none'
            });

            //draw lines at the population guidelines
            svg.selectAll('lines.guidelines').data(row_d.population_extent).enter().append('line').attr('class', 'guidelines').attr('x1', 0).attr('x2', width).attr('y1', function (d) {
                return y(d);
            }).attr('y2', function (d) {
                return y(d);
            }).attr('stroke', '#ccc').attr('stroke-dasharray', '2 2');

            //draw the sparkline
            var draw_sparkline = d3.svg.line().interpolate('cardinal').x(function (d) {
                return x(d.visitn);
            }).y(function (d) {
                return y(d.value);
            });
            var sparkline = svg.append('path').datum(overTime).attr({
                class: 'sparkLine',
                d: draw_sparkline,
                fill: 'none',
                stroke: '#999'
            });

            /*
            draw_lln = d3.svg
                .line()
                .interpolate('cardinal')
                .x(d => x(d.visitn))
                .y(d => y(d.lln)),
            lln = svg
                .append('path')
                .datum(overTime)
                .attr({
                    class: 'sparkLine',
                    d: draw_lln,
                    fill: 'none',
                    stroke: 'green'
                }),
            */
            //draw min and max points
            var minimumData = overTime.filter(function (di) {
                return di.value === d3.min(overTime.map(function (dii) {
                    return dii.value;
                }));
            })[0];
            var minimumMonth = svg.append('circle').attr({
                class: 'circle minimum',
                cx: x(minimumData.visitn),
                cy: y(minimumData.value),
                r: '2px',
                stroke: 'blue',
                fill: 'none'
            });
            var maximumData = overTime.filter(function (di) {
                return di.value === d3.max(overTime.map(function (dii) {
                    return dii.value;
                }));
            })[0];
            var maximumMonth = svg.append('circle').attr({
                class: 'circle maximum',
                cx: x(maximumData.visitn),
                cy: y(maximumData.value),
                r: '2px',
                stroke: 'orange',
                fill: 'none'
            });
        });
    }
}

function drawMeasureTable(d) {
    var chart = this;
    var config = chart.config;
    var allMatches = d.values.raw[0].raw;
    var ranges = d3.nest().key(function (d) {
        return d[config.measure_col];
    }).rollup(function (d) {
        var vals = d.map(function (m) {
            return m[config.value_col];
        }).sort(function (a, b) {
            return a - b;
        });
        var lower_extent = d3.quantile(vals, config.measureBounds[0]),
            upper_extent = d3.quantile(vals, config.measureBounds[1]);
        return [lower_extent, upper_extent];
    }).entries(chart.initial_data);

    //make nest by measure
    var nested = d3.nest().key(function (d) {
        return d[config.measure_col];
    }).rollup(function (d) {
        var measureObj = {};
        measureObj.key = d[0][config.measure_col];
        measureObj.raw = d;
        measureObj.values = d.map(function (d) {
            return +d[config.value_col];
        });
        measureObj.max = +d3.format('0.2f')(d3.max(measureObj.values));
        measureObj.min = +d3.format('0.2f')(d3.min(measureObj.values));
        measureObj.median = +d3.format('0.2f')(d3.median(measureObj.values));
        measureObj.n = measureObj.values.length;
        measureObj.spark = 'spark!';
        measureObj.population_extent = ranges.find(function (f) {
            return measureObj.key == f.key;
        }).values;
        measureObj.spark_data = d.map(function (m) {
            return {
                visitn: +m[config.visitn_col],
                value: +m[config.value_col],
                lln: +m[config.normal_col_low],
                uln: +m[config.normal_col_high]
            };
        });
        return measureObj;
    }).entries(allMatches);

    var nested = nested.map(function (m) {
        return m.values;
    }).sort(function (a, b) {
        var a_order = config.measure_details.map(function (m) {
            return m.measure;
        }).indexOf(a.key);
        var b_order = config.measure_details.map(function (m) {
            return m.measure;
        }).indexOf(b.key);
        return b_order - a_order;
    });

    //draw the measure table
    this.participantDetails.wrap.selectAll('*').style('display', null);
    this.measureTable.on('draw', addSparkLines);
    this.measureTable.draw(nested);
}

function makeParticipantHeader(d) {
    var chart = this;
    var raw = d.values.raw[0];

    var title = this.participantDetails.header.append('h3').attr('class', 'id').html('Participant Details').style('border-top', '2px solid black').style('border-bottom', '2px solid black').style('padding', '.2em');

    if (chart.config.participantProfileURL) {
        title.append('a').html('Full Participant Profile').attr('href', chart.config.participantProfileURL).style('font-size', '0.8em').style('padding-left', '1em');
    }

    title.append('Button').text('Clear').style('margin-left', '1em').style('float', 'right').on('click', function () {
        clearParticipantDetails.call(chart);
    });

    //show detail variables in a ul
    var ul = this.participantDetails.header.append('ul').style('list-style', 'none').style('padding', '0');

    var lis = ul.selectAll('li').data(chart.config.details).enter().append('li').style('', 'block').style('display', 'inline-block').style('text-align', 'center').style('padding', '0.5em');

    lis.append('div').text(function (d) {
        return d.label;
    }).attr('div', 'label').style('font-size', '0.8em');

    lis.append('div').text(function (d) {
        return raw[d.value_col];
    }).attr('div', 'value');
}

var defaultSettings = {
    max_width: 600,
    x: {
        column: null,
        type: 'ordinal',
        label: 'Visit'
    },
    y: {
        column: 'relative_uln',
        type: 'linear',
        label: 'Lab Value (x ULN)',
        domain: null,
        format: '.1f'
    },
    marks: [{
        type: 'line',
        per: []
    }, {
        type: 'circle',
        radius: 4,
        per: []
    }],
    color_by: null,
    colors: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628'],
    aspect: 2
};

function onResize$1() {
    this.marks[1].circles.attr('fill-opacity', function (d) {
        return d.values.raw[0].flagged ? 1 : 0;
    });
}

function init$1(d) {
    var chart = this;
    var config = this.config;

    var matches = d.values.raw[0].raw.filter(function (f) {
        return f.key_measure;
    });
    //flag variables above the cut-off
    matches.forEach(function (d) {
        d.cut = config.measure_details.find(function (f) {
            return f.measure == d[config['measure_col']];
        }).cut.relative_uln;

        d.flagged = d.relative_uln >= d.cut;
    });

    if ('spaghetti' in chart) {
        chart.spaghetti.destroy();
    }

    //sync settings
    defaultSettings.x.column = config.visitn_col;
    defaultSettings.y.domain = d3.extent(chart.imputed_data, function (f) {
        return f.relative_uln;
    });

    defaultSettings.color_by = config.measure_col;
    defaultSettings.marks[0].per = [config.id_col, config.measure_col];
    defaultSettings.marks[1].per = [config.id_col, config.visitn_col, config.measure_col];

    //draw that chart

    chart.spaghetti = webcharts.createChart(this.element + ' .participantDetails .spaghettiPlot', defaultSettings);
    chart.spaghetti.on('resize', onResize$1);
    chart.spaghetti.init(matches);
}

function addPointClick() {
    var chart = this;
    var config = this.config;
    var points = this.marks[0].circles;

    //add event listener to all participant level points
    points.on('click', function (d) {
        clearParticipantDetails.call(chart, d); //clear the previous participant
        chart.config.quadrants.table.wrap.style('display', 'none'); //hide the quadrant summart
        points.attr('stroke', '#ccc') //set all points to gray
        .attr('fill', 'white').classed('disabled', true); //disable mouseover while viewing participant details

        d3.select(this).attr('stroke', function (d) {
            return chart.colorScale(d.values.raw[0][config.color_by]);
        }) //highlight selected point
        .attr('stroke-width', 3);

        drawVisitPath.call(chart, d); //draw the path showing participant's pattern over time
        drawMeasureTable.call(chart, d); //draw table showing measure values with sparklines
        init$1.call(chart, d);
        makeParticipantHeader.call(chart, d);
        drawRugs.call(chart, d, 'x');
        drawRugs.call(chart, d, 'y');
    });
}

function addTitle() {
    var config = this.config;
    var points = this.marks[0].circles;
    points.select('title').remove();
    points.append('title').text(function (d) {
        var xvar = config.x.measure_detail.label;
        var yvar = config.y.measure_detail.label;
        var raw = d.values.raw[0],
            xLabel = config.x.label + ': ' + d3.format('0.2f')(raw[xvar]) + ' @ V' + raw[xvar + '_' + config.visitn_col] + ' (Day ' + raw[xvar + '_' + config.studyday_col] + ')',
            yLabel = config.y.label + ': ' + d3.format('0.2f')(raw[yvar]) + ' @ V' + raw[yvar + '_' + config.visitn_col] + ' (Day ' + raw[yvar + '_' + config.studyday_col] + ')',
            dayDiff = raw['day_diff'] + ' days apart',
            idLabel = 'Participant ID: ' + raw[config.id_col];
        return idLabel + '\n' + xLabel + '\n' + yLabel + '\n' + dayDiff;
    });
}

function setPointSize() {
    var _this = this;

    var chart = this;
    var config = this.config;
    var points = this.marks[0].circles;

    if (config.point_size != 'Uniform') {
        //create the scale
        var sizeScale = d3.scale.linear().range([2, 10]).domain(d3.extent(chart.raw_data.map(function (m) {
            return m[config.point_size];
        })));

        //draw a legend (coming later?)

        //set the point radius
        points.transition().attr('r', function (d) {
            var raw = d.values.raw[0];
            return sizeScale(raw[config.point_size]);
        }).attr('cx', function (d) {
            return _this.x(d.values.x);
        }).attr('cy', function (d) {
            return _this.y(d.values.y);
        });
    }
}

function setPointOpacity() {
    var config = this.config;
    var points = this.marks[0].circles;

    points.attr('fill-opacity', function (d) {
        return d.values.raw[0].day_diff <= config.visit_window ? 1 : 0;
    }); //fill points in visit_window
}

// Reposition any exisiting participant marks when the chart is resized
function updateParticipantMarks() {
    var chart = this;
    var config = this.config;

    //reposition participant visit path
    var myNewLine = d3.svg.line().x(function (d) {
        return chart.x(d.x);
    }).y(function (d) {
        return chart.y(d.y);
    });

    chart.visitPath.select('path').transition().attr('d', myNewLine);

    //reposition participant visit circles and labels
    chart.visitPath.selectAll('g.visit-point').select('circle').transition().attr('cx', function (d) {
        return chart.x(d.x);
    }).attr('cy', function (d) {
        return chart.y(d.y);
    });

    chart.visitPath.selectAll('g.visit-point').select('text.participant-visits').transition().attr('x', function (d) {
        return chart.x(d.x);
    }).attr('y', function (d) {
        return chart.y(d.y);
    });

    //reposition axis rugs
    chart.x_rug.selectAll('text').transition().attr('x', function (d) {
        return chart.x(d[config.display]);
    }).attr('y', function (d) {
        return chart.y(chart.y.domain()[0]);
    });

    chart.y_rug.selectAll('text').transition().attr('x', function (d) {
        return chart.x(chart.x.domain()[0]);
    }).attr('y', function (d) {
        return chart.y(d[config.display]);
    });
}

function drawQuadrants() {
    var _this = this;

    var config = this.config;

    //position for cut-point lines
    this.config.quadrants.cut_lines.filter(function (d) {
        return d.dimension == 'x';
    }).attr('x1', this.x(config.quadrants.cut_data.x)).attr('x2', this.x(config.quadrants.cut_data.x)).attr('y1', this.plot_height).attr('y2', 0);

    this.config.quadrants.cut_lines.filter(function (d) {
        return d.dimension == 'y';
    }).attr('x1', 0).attr('x2', this.plot_width).attr('y1', function (d) {
        return _this.y(config.quadrants.cut_data.y);
    }).attr('y2', function (d) {
        return _this.y(config.quadrants.cut_data.y);
    });

    this.config.quadrants.cut_lines_backing.filter(function (d) {
        return d.dimension == 'x';
    }).attr('x1', this.x(config.quadrants.cut_data.x)).attr('x2', this.x(config.quadrants.cut_data.x)).attr('y1', this.plot_height).attr('y2', 0);

    this.config.quadrants.cut_lines_backing.filter(function (d) {
        return d.dimension == 'y';
    }).attr('x1', 0).attr('x2', this.plot_width).attr('y1', function (d) {
        return _this.y(config.quadrants.cut_data.y);
    }).attr('y2', function (d) {
        return _this.y(config.quadrants.cut_data.y);
    });

    //position labels
    this.config.quadrants.group_labels.select('text.upper-right').attr('x', this.plot_width).attr('y', 0);

    this.config.quadrants.group_labels.select('text.upper-left').attr('x', 0).attr('y', 0);

    this.config.quadrants.group_labels.select('text.lower-right').attr('x', this.plot_width).attr('y', this.plot_height);

    this.config.quadrants.group_labels.select('text.lower-left').attr('x', 0).attr('y', this.plot_height);

    this.config.quadrants.group_labels.selectAll('text')
    //    .attr('display', d => (d.count == 0 ? 'none' : null))
    .text(function (d) {
        return d.label + ' (' + d.percent + ')';
    });
}

function dragStarted() {
    var dimension = d3.select(this).classed('x') ? 'x' : 'y';
    var chart = d3.select(this).datum().chart;

    d3.select(this).select('line.cut-line').attr('stroke-width', '2').attr('stroke-dasharray', '2,2');

    chart.config.quadrants.group_labels.style('display', 'none');
}

function dragged() {
    var chart = d3.select(this).datum().chart;

    var x = d3.event.dx;
    var y = d3.event.dy;

    var line = d3.select(this).select('line.cut-line');
    var lineBack = d3.select(this).select('line.cut-line-backing');

    var dimension = d3.select(this).classed('x') ? 'x' : 'y';

    // Update the line properties
    var attributes = {
        x1: Math.max(0, parseInt(line.attr('x1')) + (dimension == 'x' ? x : 0)),
        x2: Math.max(0, parseInt(line.attr('x2')) + (dimension == 'x' ? x : 0)),
        y1: Math.min(chart.plot_height, parseInt(line.attr('y1')) + (dimension == 'y' ? y : 0)),
        y2: Math.min(chart.plot_height, parseInt(line.attr('y2')) + (dimension == 'y' ? y : 0))
    };

    line.attr(attributes);
    lineBack.attr(attributes);

    var rawCut = line.attr(dimension + '1');
    var current_cut = +d3.format('0.1f')(chart[dimension].invert(rawCut));

    //update the cut control in real time
    chart.controls.wrap.selectAll('div.control-group').filter(function (f) {
        return f.option == 'quadrants.cut_data.' + dimension;
    }).select('input').node().value = current_cut;

    chart.config.quadrants.cut_data[dimension] = current_cut;
}

function dragEnded() {
    var chart = d3.select(this).datum().chart;

    d3.select(this).select('line.cut-line').attr('stroke-width', '1').attr('stroke-dasharray', '5,5');
    chart.config.quadrants.group_labels.style('display', null);

    //redraw the chart (updates the needed cutpoint settings and quadrant annotations)
    chart.draw();
}

function init$2() {
    var drag = d3.behavior.drag().origin(function (d) {
        return d;
    }).on('dragstart', dragStarted).on('drag', dragged).on('dragend', dragEnded);

    this.config.quadrants.wrap.moveToFront();
    this.config.quadrants.cut_g.call(drag);
}

function toggleLegend() {
    var hideLegend = this.config.color_by == 'NONE';
    this.wrap.select('.legend').style('display', hideLegend ? 'None' : null);
}

function addBoxPlot(svg, results, height, width, domain, boxPlotWidth, boxColor, boxInsideColor, fmt, horizontal, log) {
    //set default orientation to "horizontal"
    var horizontal = horizontal == undefined ? true : horizontal;

    //make the results numeric and sort
    var results = results.map(function (d) {
        return +d;
    }).sort(d3.ascending);

    //set up d3.scales
    if (horizontal) {
        var y = log ? d3.scale.log() : d3.scale.linear();
        y.range([height, 0]).domain(domain);
        var x = d3.scale.linear().range([0, width]);
    } else {
        var x = log ? d3.scale.log() : d3.scale.linear();
        x.range([0, width]).domain(domain);
        var y = d3.scale.linear().range([height, 0]);
    }

    var probs = [0.05, 0.25, 0.5, 0.75, 0.95];
    for (var i = 0; i < probs.length; i++) {
        probs[i] = d3.quantile(results, probs[i]);
    }

    var boxplot = svg.append('g').attr('class', 'boxplot').datum({ values: results, probs: probs });

    //set bar width variable
    var box_x = horizontal ? x(0.5 - boxPlotWidth / 2) : x(probs[1]);
    var box_width = horizontal ? x(0.5 + boxPlotWidth / 2) - x(0.5 - boxPlotWidth / 2) : x(probs[3]) - x(probs[1]);
    var box_y = horizontal ? y(probs[3]) : y(0.5 + boxPlotWidth / 2);
    var box_height = horizontal ? -y(probs[3]) + y(probs[1]) : y(0.5 - boxPlotWidth / 2) - y(0.5 + boxPlotWidth / 2);

    boxplot.append('rect').attr('class', 'boxplot fill').attr('x', box_x).attr('width', box_width).attr('y', box_y).attr('height', box_height).style('fill', boxColor);

    //draw dividing lines at d3.median, 95% and 5%
    var iS = [0, 2, 4];
    var iSclass = ['', 'd3.median', ''];
    var iSColor = [boxColor, boxInsideColor, boxColor];
    for (var i = 0; i < iS.length; i++) {
        boxplot.append('line').attr('class', 'boxplot ' + iSclass[i]).attr('x1', horizontal ? x(0.5 - boxPlotWidth / 2) : x(probs[iS[i]])).attr('x2', horizontal ? x(0.5 + boxPlotWidth / 2) : x(probs[iS[i]])).attr('y1', horizontal ? y(probs[iS[i]]) : y(0.5 - boxPlotWidth / 2)).attr('y2', horizontal ? y(probs[iS[i]]) : y(0.5 + boxPlotWidth / 2)).style('fill', iSColor[i]).style('stroke', iSColor[i]);
    }

    //draw lines from 5% to 25% and from 75% to 95%
    var iS = [[0, 1], [3, 4]];
    for (var i = 0; i < iS.length; i++) {
        boxplot.append('line').attr('class', 'boxplot').attr('x1', horizontal ? x(0.5) : x(probs[iS[i][0]])).attr('x2', horizontal ? x(0.5) : x(probs[iS[i][1]])).attr('y1', horizontal ? y(probs[iS[i][0]]) : y(0.5)).attr('y2', horizontal ? y(probs[iS[i][1]]) : y(0.5)).style('stroke', boxColor);
    }

    boxplot.append('circle').attr('class', 'boxplot d3.mean').attr('cx', horizontal ? x(0.5) : x(d3.mean(results))).attr('cy', horizontal ? y(d3.mean(results)) : y(0.5)).attr('r', horizontal ? x(boxPlotWidth / 3) : y(1 - boxPlotWidth / 3)).style('fill', boxInsideColor).style('stroke', boxColor);

    boxplot.append('circle').attr('class', 'boxplot d3.mean').attr('cx', horizontal ? x(0.5) : x(d3.mean(results))).attr('cy', horizontal ? y(d3.mean(results)) : y(0.5)).attr('r', horizontal ? x(boxPlotWidth / 6) : y(1 - boxPlotWidth / 6)).style('fill', boxColor).style('stroke', 'None');

    var formatx = fmt ? d3.format(fmt) : d3.format('.2f');

    boxplot.selectAll('.boxplot').append('title').text(function (d) {
        return 'N = ' + d.values.length + '\n' + 'd3.min = ' + d3.min(d.values) + '\n' + '5th % = ' + formatx(d3.quantile(d.values, 0.05)) + '\n' + 'Q1 = ' + formatx(d3.quantile(d.values, 0.25)) + '\n' + 'd3.median = ' + formatx(d3.median(d.values)) + '\n' + 'Q3 = ' + formatx(d3.quantile(d.values, 0.75)) + '\n' + '95th % = ' + formatx(d3.quantile(d.values, 0.95)) + '\n' + 'd3.max = ' + d3.max(d.values) + '\n' + 'd3.mean = ' + formatx(d3.mean(d.values)) + '\n' + 'StDev = ' + formatx(d3.deviation(d.values));
    });
}

function init$3() {
    // Draw box plots
    this.svg.selectAll('g.boxplot').remove();

    // Y-axis box plot
    var yValues = this.current_data.map(function (d) {
        return d.values.y;
    });
    var ybox = this.svg.append('g').attr('class', 'yMargin');
    addBoxPlot(ybox, yValues, this.plot_height, 1, this.y_dom, 10, '#bbb', 'white', '0.2f', true, this.config.y.type == 'log');
    ybox.select('g.boxplot').attr('transform', 'translate(' + (this.plot_width + this.config.margin.right / 2) + ',0)');

    //X-axis box plot
    var xValues = this.current_data.map(function (d) {
        return d.values.x;
    });
    var xbox = this.svg.append('g').attr('class', 'xMargin');
    addBoxPlot(xbox, //svg element
    xValues, //values
    1, //height
    this.plot_width, //width
    this.x_dom, //domain
    10, //box plot width
    '#bbb', //box color
    'white', //detail color
    '0.2f', //format
    false, // horizontal?
    this.config.y.type == 'log' // log?
    );
    xbox.select('g.boxplot').attr('transform', 'translate(0,' + -(this.config.margin.top / 2) + ')');
}

function adjustTicks() {
    this.svg.selectAll('.x.axis .tick text').attr({
        transform: 'rotate(-45)',
        dx: -10,
        dy: 10
    }).style('text-anchor', 'end');
}

function onResize() {
    //add point interactivity, custom title and formatting
    addPointMouseover.call(this);
    addPointClick.call(this);
    addTitle.call(this);
    formatPoints.call(this);
    setPointSize.call(this);
    setPointOpacity.call(this);
    updateParticipantMarks.call(this);

    //draw the quadrants and add drag interactivity
    updateSummaryTable.call(this);
    drawQuadrants.call(this);
    init$2.call(this);

    // hide the legend if no group options are given
    toggleLegend.call(this);

    // add boxplots
    init$3.call(this);

    //axis formatting
    adjustTicks.call(this);
}

function safetyedish$1(element, settings) {
    var initial_settings = clone(settings);
    var defaultSettings = configuration.settings();
    var controlInputs = configuration.controlInputs();
    var mergedSettings = Object.assign({}, defaultSettings, settings);
    var syncedSettings = configuration.syncSettings(mergedSettings);
    var syncedControlInputs = configuration.syncControlInputs(controlInputs, syncedSettings);
    var controls = webcharts.createControls(element, { location: 'top', inputs: syncedControlInputs });
    var chart = webcharts.createChart(element, syncedSettings, controls);

    chart.element = element;
    chart.initial_settings = initial_settings;

    //Define callbacks.
    chart.on('init', onInit);
    chart.on('layout', onLayout);
    chart.on('preprocess', onPreprocess);
    chart.on('datatransform', onDataTransform);
    chart.on('draw', onDraw);
    chart.on('resize', onResize);

    return chart;
}

return safetyedish$1;

})));
