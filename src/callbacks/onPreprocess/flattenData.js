import addParticipantLevelMetadata from './flattenData/addParticipantLevelMetadata';
import calculateRRatio from './flattenData/calculateRRatio';

//Converts a one record per measure data object to a one record per participant objects
export function flattenData() {
    var chart = this;
    var config = this.config;

    //make a data set with one row per ID

    //get list of columns to flatten
    var colList = [];
    var measureCols = [
        'measure_col',
        'value_col',
        'studyday_col',
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
        ['absolute', 'relative_uln', 'relative_baseline', 'baseline_absolute', 'analysisFlag']
    ]);

    //get maximum values for each measure type
    var flat_data = d3
        .nest()
        .key(f => f[config.id_col])
        .rollup(function(d) {
            var participant_obj = {};
            participant_obj.days_x = null;
            participant_obj.days_y = null;
            Object.keys(config.measure_values).forEach(function(mKey) {
                //get all raw data for the current measure
                var matches = d
                    .filter(f => config.measure_values[mKey] == f[config.measure_col]) //get matching measures
                    .filter(f => f.analysisFlag);

                if (matches.length == 0) {
                    if (config.debug) {
                        console.warn(
                            'No analysis records found for ' + d[0][config.id_col] + ' for ' + mKey
                        );
                    }

                    participant_obj.drop_participant = true;
                    participant_obj.drop_reason =
                        'No analysis results found for 1+ key measure, including ' + mKey + '.';
                    return participant_obj;
                } else {
                    participant_obj.drop_participant = false;
                }

                //get record with maximum value for the current display type
                participant_obj[mKey] = d3.max(matches, d => +d[config.display]);

                var maxRecord = matches.find(d => participant_obj[mKey] == +d[config.display]);
                //map all measure specific values
                colList.forEach(function(col) {
                    participant_obj[mKey + '_' + col] = maxRecord[col];
                });

                //determine whether the value is above the specified threshold
                if (config.cuts[mKey][config.display]) {
                    config.show_quadrants = true;
                    participant_obj[mKey + '_cut'] = config.cuts[mKey][config.display];
                    participant_obj[mKey + '_flagged'] =
                        participant_obj[mKey] >= participant_obj[mKey + '_cut'];
                } else {
                    config.show_quadrants = false;
                    participant_obj[mKey + '_cut'] = null;
                    participant_obj[mKey + '_flagged'] = null;
                }

                //save study days for each axis;
                if (mKey == config.x.column)
                    participant_obj.days_x = maxRecord[config.studyday_col];
                if (mKey == config.y.column)
                    participant_obj.days_y = maxRecord[config.studyday_col];
            });

            //Add participant level metadata
            addParticipantLevelMetadata.call(chart, d, participant_obj);

            //Calculate ratios between measures.
            calculateRRatio.call(chart, d, participant_obj);

            //calculate the day difference between x and y
            participant_obj.day_diff = Math.abs(participant_obj.days_x - participant_obj.days_y);

            return participant_obj;
        })
        .entries(this.imputed_data.filter(f => f.key_measure));

    chart.dropped_participants = flat_data
        .filter(f => f.values.drop_participant)
        .map(function(d) {
            return {
                id: d.key,
                drop_reason: d.values.drop_reason,
                allrecords: chart.initial_data.filter(f => f[config.id_col] == d.key)
            };
        });
    var flat_data = flat_data
        .filter(f => !f.values.drop_participant)
        .map(function(m) {
            m.values[config.id_col] = m.key;

            //link the raw data to the flattened object
            var allMatches = chart.imputed_data.filter(f => f[config.id_col] == m.key);
            m.values.raw = allMatches;

            return m.values;
        });
    return flat_data;
}
