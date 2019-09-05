import getMaxValues from './flattenData/getMaxValues';
import getFlatCols from './flattenData/getFlatCols';

//Converts a one record per measure data object to a one record per participant objects
export function flattenData() {
    var chart = this;
    var config = this.config;

    //////////////////////////////////////////////
    //make a data set with one object per ID
    /////////////////////////////////////////////

    //get a list of columns to flatten
    config.flat_cols = getFlatCols.call(this);

    //get maximum values for each measure type
    var flat_data = d3
        .nest()
        .key(f => f[config.id_col])
        .rollup(d => getMaxValues.call(chart, d))
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
