export default function calculateRRatios(d, participant_obj) {
    var chart = this;
    var config = this.config;
    //R-ratio should be the ratio of ALT to ALP, i.e. the x-axis to the z-axis.
    participant_obj.rRatio_overall =
        participant_obj['ALT_relative_uln'] / participant_obj['ALP_relative_uln'];

    //get r-ratio data for every visit where both ALT and ALP are available
    var allMatches = chart.imputed_data.filter(
        f => f[config.id_col] == participant_obj[config.id_col]
    );

    var raw_alt = allMatches
        .filter(d => d[config.measure_col] == config.measure_values.ALT)
        .map(function(m) {
            m.day = m[config.studyday_col];
            m.alt_relative_uln = m.relative_uln;
            return m;
        });

    participant_obj.rRatio_raw = allMatches
        .filter(f => f[config.measure_col] == config.measure_values.ALP)
        .map(function(m) {
            var obj = {};
            obj.day = m[config.studyday_col];
            obj.alp_relative_uln = m.relative_uln;
            return obj;
        })
        .filter(function(f) {
            var matched_alt = raw_alt.find(fi => fi.day == f.day);
            f.alt_relative_uln = matched_alt ? matched_alt.relative_uln : null;
            f.rRatio = f['alt_relative_uln'] / f['alp_relative_uln'];
            return f.rRatio;
        });
    participant_obj.rRatio_max = d3.max(participant_obj.rRatio_raw, f => f.rRatio);
    participant_obj.rRatio = d3.max([participant_obj.rRatio_max, participant_obj.rRatio_overall]);
}
