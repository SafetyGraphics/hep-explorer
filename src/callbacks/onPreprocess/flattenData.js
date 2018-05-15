import { merge } from 'd3';
//Converts a one record per measure data object to a one record per participant objects
export function flattenData() {
    var chart = this;
    var config = this.config;
    //make a data set with one row per ID

    //filter the lab data to only the required measures
    var included_measures = config.measure_details.map(m => m.measure);

    var sub = this.initial_data
        .filter(f => included_measures.indexOf(f[config.measure_col]) > -1)
        .filter(f => true); //add a filter on selected visits here

    //get the relative value (% of the upper limit of normal) for the measure
    sub.forEach(function(d) {
        var numerics = ['value_col', 'visitn_col', 'normal_col_low', 'normal_col_high'];

        numerics.forEach(function(col) {
            d[config[col]] = +d[config[col]];
        });

        d.relative = d[config.value_col] / d[config.normal_col_high];
    });

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

    colList.push('relative');

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

                //get record with maximum value for the current display type
                participant_obj[m.label] = d3.max(
                    matches,
                    d => (config.display == 'absolute' ? d[config.value_col] : d.relative)
                );
                var maxRecord = matches.find(
                    d =>
                        participant_obj[m.label] ==
                        (config.display == 'absolute' ? d[config.value_col] : d.relative)
                );

                //map all measure specific values
                colList.forEach(function(col) {
                    participant_obj[m.label + '_' + col] = maxRecord[col];
                });

                //determine whether the value is above the specified threshold
                participant_obj[m.label + '_cut'] = m.cut[config.display];
                participant_obj[m.label + '_flagged'] =
                    participant_obj[m.label] >= participant_obj[m.label + '_cut'];

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
        .entries(sub);

    var flat_data = flat_data.map(function(m) {
        m.values[config.id_col] = m.key;

        //link the raw data to the flattened object
        var allMatches = chart.initial_data.filter(f => f[config.id_col] == m.key);
        m.values.raw = allMatches;

        return m.values;
    });

    return flat_data;
}
