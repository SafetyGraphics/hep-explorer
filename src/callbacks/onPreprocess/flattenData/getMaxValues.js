import addParticipantLevelMetadata from './addParticipantLevelMetadata';
import calculateRRatio from './calculateRRatio';
import { extent } from 'd3';

export default function getMaxValues(d) {
    var chart = this;
    var config = this.config;

    var participant_obj = {};
    participant_obj.days_x = null;
    participant_obj.days_y = null;
    participant_obj.outOfRange = false;
    Object.keys(config.measure_values).forEach(function(mKey) {
        //get all raw data for the current measure
        var matches = d
            .filter(f => config.measure_values[mKey] == f[config.measure_col]) //get matching measures
            .filter(f => f.analysisFlag);

        participant_obj.drop_participant = matches.length === 0;

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
            participant_obj[mKey + '_raw'] = matches
                .map(function(m, i) {
                    return {
                        value: m[config.display],
                        day: m[config.studyday_col]
                    };
                })
                .sort(function(a, b) {
                    return a.day - b.day;
                });

            //get the current record for each participant
            if (config.plot_max_values) {
                //get record with maximum value for the current display type
                participant_obj[mKey] = d3.max(matches, d => +d[config.display]);
            } else {
                //see if all selected config.plot_day was while participant was enrolled
                var first = participant_obj[mKey + '_raw'][0];
                var last = participant_obj[mKey + '_raw'].pop();
                var before = config.plot_day < first.day;
                var after = config.plot_day > last.day;
                participant_obj.outOfRange = participant_obj.outOfRange || before || after;

                //get the most recent measure on or before config.plot_day
                var onOrBefore = participant_obj[mKey + '_raw'].filter(
                    di => di.day <= config.plot_day
                );
                var latest = onOrBefore.pop();

                participant_obj[mKey] = latest ? latest.value : first.value;
            }

            var maxRecord = matches.find(d => participant_obj[mKey] == +d[config.display]);

            //map all measure specific values
            config.flat_cols.forEach(function(col) {
                participant_obj[mKey + '_' + col] = maxRecord ? maxRecord[col] : null;
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
            if (maxRecord) {
                if (mKey == config.x.column)
                    participant_obj.days_x = maxRecord[config.studyday_col];
                if (mKey == config.y.column)
                    participant_obj.days_y = maxRecord[config.studyday_col];
            }
        }
    });

    //Add participant level metadata
    addParticipantLevelMetadata.call(chart, d, participant_obj);

    //Calculate ratios between measures.
    calculateRRatio.call(chart, d, participant_obj);

    //calculate the day difference between x and y
    participant_obj.day_diff = Math.abs(participant_obj.days_x - participant_obj.days_y);

    var vals = d.filter(f => f.analysisFlag).filter(f => f.key_measure);
    participant_obj.day_range = extent(vals, d => d[config.studyday_col]);

    //check if both x and y are in range
    if (!config.plot_max_values) {
        participant_obj;
    }

    return participant_obj;
}