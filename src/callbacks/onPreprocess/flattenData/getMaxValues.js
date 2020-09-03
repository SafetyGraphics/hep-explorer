import addParticipantLevelMetadata from './addParticipantLevelMetadata';
import calculateRRatios from './calculateRRatio';

export default function getMaxValues(d) {
    var chart = this;
    var config = this.config;

    var participant_obj = {};
    participant_obj.days_x = null;
    participant_obj.days_y = null;
    participant_obj.outOfRange = false;
    Object.keys(config.measure_values).forEach(function(mKey) {
        //get all raw data for the current measure
        var all_matches = d
            .filter(f => config.measure_values[mKey] == f[config.measure_col]) //get matching measures
            .sort(function(a, b) {
                return a[config.studyday_col] - b[config.studyday_col];
            });

        //Drop Participants with no analysis data
        var analysis_matches = all_matches.filter(f => f.analysisFlag);
        participant_obj.drop_participant = analysis_matches.length === 0;

        if (participant_obj.drop_participant) {
            if (config.debug) {
                console.warn(
                    'No analysis records found for ' + d[0][config.id_col] + ' for ' + mKey
                );
            }

            participant_obj.drop_reason =
                'No analysis results found for 1+ key measure, including ' + mKey + '.';
        } else {
            //keep an array of all [value, studyday] pairs for the measure
            participant_obj[mKey + '_raw'] = all_matches.map(function(m, i) {
                return {
                    value: m[config.display],
                    day: m[config.studyday_col],
                    analysisFlag: m.analysisFlag
                };
            });

            var currentRecord = null;
            //get the current record for each participant
            if (config.plot_max_values) {
                //get record with maximum value for the current display type
                const max_value = d3.max(analysis_matches, d => +d[config.display]);
                var currentRecords = analysis_matches.filter(d => max_value == +d[config.display]);
                if (config.debug & (currentRecords.length > 1)) {
                    var firstDay = currentRecords[0][config.studyday_col];
                    var id = currentRecords[0][config.id_col];
                    console.warn(
                        'Found duplicate maximum ' +
                            mKey +
                            ' values for ' +
                            id +
                            '. Using first value from study day ' +
                            firstDay +
                            ' for timing calculations.'
                    );
                }
                var currentRecord = currentRecords[0];
                participant_obj[mKey] = +currentRecord[config.display];
            } else {
                //see if all selected config.plot_day was while participant was enrolled
                var first = all_matches[0];
                var last = all_matches[all_matches.length - 1];

                if ([config.x.column, config.y.column].includes(mKey)) {
                    // out-of-range should be calculated study day of with x- and y-axis measures
                    var before = config.plot_day < first[config.studyday_col];
                    var after = config.plot_day > last[config.studyday_col];
                    participant_obj.outOfRange = participant_obj.outOfRange || before || after;
                }

                //get the most recent measure on or before config.plot_day
                var onOrBefore = all_matches.filter(di => {
                    return di[config.studyday_col] <= config.plot_day;
                });
                var latest = onOrBefore[onOrBefore.length - 1];

                currentRecord = latest ? latest : first;
                participant_obj[mKey] = currentRecord[config.display];
            }
            //  var currentRecord = all_matches.find(d => participant_obj[mKey] == +d[config.display]);

            //map all measure specific values
            config.flat_cols.forEach(function(col) {
                participant_obj[mKey + '_' + col] = currentRecord ? currentRecord[col] : null;
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
            if (currentRecord) {
                if (mKey == config.x.column)
                    participant_obj.days_x = currentRecord[config.studyday_col];
                if (mKey == config.y.column)
                    participant_obj.days_y = currentRecord[config.studyday_col];
            }
        }
    });

    //Add participant level metadata
    addParticipantLevelMetadata.call(chart, d, participant_obj);

    //Calculate ratios between measures.
    calculateRRatios.call(chart, d, participant_obj);
    //calculateNRRatio.call(chart, d, participant_obj);

    //calculate the day difference between x and y and total day range for all measure values
    participant_obj.day_diff = Math.abs(participant_obj.days_x - participant_obj.days_y);
    participant_obj.day_range = d3.extent(d, d => d[config.studyday_col]);

    return participant_obj;
}
