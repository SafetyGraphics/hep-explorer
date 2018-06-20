import { merge } from 'd3';
//Converts a one record per measure data object to a one record per participant objects
export function flattenData() {
    var chart = this;
    var config = this.config;
    //make a data set with one row per ID

    //filter the lab data to only the required measures
    var included_measures = config.measure_details.map(m => m.measure);

    var sub = this.imputed_data
        .filter(f => included_measures.indexOf(f[config.measure_col]) > -1)
        .filter(f => true); //add a filter on selected visits here

    var missingBaseline = 0;
    this.imputed_data.forEach(function(d) {
        //coerce numeric values to number
        var numerics = ['value_col', 'visitn_col', 'normal_col_low', 'normal_col_high'];
        numerics.forEach(function(col) {
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
            var baseline_record = sub
                .filter(f => d[config.id_col] == f[config.id_col])
                .filter(f => d[config.measure_col] == f[config.measure_col])
                .filter(f => f[config.visitn_col] == +config.baseline_visitn);

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

    if (missingBaseline > 0)
        console.log(
            'No baseline value found for ' + missingBaseline + ' of ' + sub.length + ' records.'
        );

    //get list of columns to flatten
    var colList = [];
    var measureCols = [
        'measure_col',
        'value_col',
        'visit_col',
        'visitn_col',
        'studyday_col',
        'unit_col',
        'normal_col_low',
        'normal_col_high'
    ];

    measureCols.forEach(function(d) {
        if (Array.isArray(d)) {
            d.forEach(function(di) {
                colList.push(di.hasOwnProperty('value_col') ? config[di.value_col] : config[di]);
            });
        } else {
            colList.push(d.hasOwnProperty('value_col') ? config[d.value_col] : config[d]);
        }
    });

    //merge in the absolute and relative values
    colList = d3.merge([
        colList,
        ['absolute', 'relative_uln', 'relative_baseline', 'baseline_raw']
    ]);

    //get maximum values for each measure type
    var flat_data = d3
        .nest()
        .key(f => f[config.id_col])
        .rollup(function(d) {
            var participant_obj = {};
            participant_obj.days_x = null;
            participant_obj.days_y = null;
            config.measure_details.forEach(function(m) {
                //get all raw data for the current measure
                var matches = d.filter(f => m.measure == f[config.measure_col]); //get matching measures

                if (matches.length == 0) {
                    console.log('No matches found');
                    participant_obj.drop_participant = true;
                    return participant_obj;
                } else {
                    participant_obj.drop_participant = false;
                }

                //get record with maximum value for the current display type
                participant_obj[m.label] = d3.max(matches, d => +d[config.display]);

                var maxRecord = matches.find(d => participant_obj[m.label] == +d[config.display]);
                //map all measure specific values
                colList.forEach(function(col) {
                    participant_obj[m.label + '_' + col] = maxRecord[col];
                });

                //determine whether the value is above the specified threshold
                if (m.cut[config.display]) {
                    config.show_quadrants = true;
                    participant_obj[m.label + '_cut'] = m.cut[config.display];
                    participant_obj[m.label + '_flagged'] =
                        participant_obj[m.label] >= participant_obj[m.label + '_cut'];
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
            var varList = [];
            if (chart.config.filters) {
                var filterVars = chart.config.filters.map(
                    d => (d.hasOwnProperty('value_col') ? d.value_col : d)
                );
                varList = d3.merge([varList, filterVars]);
            }
            if (chart.config.group_cols) {
                var groupVars = chart.config.group_cols.map(
                    d => (d.hasOwnProperty('value_col') ? d.value_col : d)
                );
                varList = d3.merge([varList, groupVars]);
            }
            if (chart.config.details) {
                var detailVars = chart.config.details.map(
                    d => (d.hasOwnProperty('value_col') ? d.value_col : d)
                );
                varList = d3.merge([varList, detailVars]);
            }

            varList.forEach(function(v) {
                participant_obj[v] = d[0][v];
            });

            //calculate the day difference between x and y
            participant_obj.day_diff = Math.abs(participant_obj.days_x - participant_obj.days_y);

            return participant_obj;
        })
        .entries(this.imputed_data.filter(f => f.key_measure));

    var flat_data = flat_data.filter(f => f.values.drop_participant == false).map(function(m) {
        m.values[config.id_col] = m.key;

        //link the raw data to the flattened object
        var allMatches = chart.imputed_data.filter(f => f[config.id_col] == m.key);
        m.values.raw = allMatches;

        return m.values;
    });
    return flat_data;
}
