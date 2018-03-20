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
        d.relative = d[config.value_col] / d[config.normal_col_high];
    });

    //get maximum values for each measure type
    var flat_data = d3
        .nest()
        .key(f => f[config.id_col])
        .rollup(function(d) {
            var participant_obj = {};
            config.measure_details.forEach(function(m) {
                var matches = d.filter(f => m.measure == f[config.measure_col]); //get matching measures

                //get max raw value
                participant_obj[m.label + '_absolute'] = d3.max(matches, d => d[config.value_col]);
                participant_obj[m.label + '_absolute_flagged'] =
                    participant_obj[m.label + '_absolute'] > m.cut.absolute;

                //get max relative value and flagged status
                participant_obj[m.label + '_relative'] = d3.max(matches, d => d.relative);
                participant_obj[m.label + '_relative_flagged'] =
                    participant_obj[m.label + '_relative'] > m.cut.relative;
            });

            //Add participant level metadata
            var filterVars = chart.config.filters.map(d => d.value_col);
            var groupVars = chart.config.group_cols.map(d => d.value_col);
            var varList = merge([filterVars, groupVars]);

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
        var allMatches = chart.initial_data.filter(f => f[config.id_col] == m.key);
        m.values.raw = allMatches;

        return m.values;
    });
    return flat_data;
}
