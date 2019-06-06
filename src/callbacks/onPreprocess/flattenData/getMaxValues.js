import addParticipantLevelMetadata from './addParticipantLevelMetadata';
import calculateRRatio from './calculateRRatio';

export default function getMaxValues(d) {
    var chart = this;
    var config = this.config;
    
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
        config.flat_cols.forEach(function(col) {
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
        if (mKey == config.x.column) participant_obj.days_x = maxRecord[config.studyday_col];
        if (mKey == config.y.column) participant_obj.days_y = maxRecord[config.studyday_col];
    });

    //Add participant level metadata
    addParticipantLevelMetadata.call(chart, d, participant_obj);

    //Calculate ratios between measures.
    calculateRRatio.call(chart, d, participant_obj);

    //calculate the day difference between x and y
    participant_obj.day_diff = Math.abs(participant_obj.days_x - participant_obj.days_y);

    return participant_obj;
}
