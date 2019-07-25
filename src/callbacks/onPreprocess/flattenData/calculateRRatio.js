export default function calculateRRatios(d, participant_obj) {
    var chart = this;
    var config = this.config;

    // R-ratio should be the ratio of ALT to ALP

    // For current time point or maximal values (depends on view)
    participant_obj.rRatio_current =
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
            m.day = m[config.studyday_col];
            m.alp_relative_uln = m.relative_uln;
            return m;
        })
        .filter(function(f) {
            var matched_alt = raw_alt.find(fi => fi.day == f.day);
            f.alt_relative_uln = matched_alt ? matched_alt.relative_uln : null;
            f.rRatio = f['alt_relative_uln'] / f['alp_relative_uln'];
            f.value = f.rRatio;
            return f.rRatio;
        });

    //max rRatios across visits
    participant_obj.rRatio_max = d3.max(participant_obj.rRatio_raw, f => f.rRatio); //max rRatio for all visits
    participant_obj.rRatio_max_anly = d3.max(
        participant_obj.rRatio_raw.filter(f => f.analysisFlag),
        f => f.rRatio
    );

    // rRatio at time of max ALT
    let maxAltRecord = participant_obj.rRatio_raw
        .filter(f => f.analysisFlag)
        .sort(function(a, b) {
            return b.alt_relative_uln - a.alt_relative_uln; //descending sort (so max is first value)
        })[0];

    participant_obj.rRatio_max_alt = maxAltRecord ? maxAltRecord.rRatio : null;

    // Use the r ratio at the tme of the max ALT value for standard eDish, otherwise use rRatio from the current time point
    participant_obj.rRatio = config.plot_max_values
        ? participant_obj.rRatio_max_alt
        : participant_obj.rRatio_current;
}
