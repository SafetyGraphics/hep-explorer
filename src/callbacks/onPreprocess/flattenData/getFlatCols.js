export default function getFlatCols() {
    var config = this.config;

    //get list of columns to flatten
    var flat_cols = [];
    var user_cols = [
        'measure_col',
        'value_col',
        'studyday_col',
        'normal_col_low',
        'normal_col_high'
    ];
    var derived_cols = [
        'absolute',
        'relative_uln',
        'relative_baseline',
        'baseline_absolute',
        'analysisFlag'
    ];

    // populate the full list of columns to flatten labels
    user_cols.forEach(function(d) {
        if (Array.isArray(d)) {
            d.forEach(function(di) {
                flat_cols.push(di.hasOwnProperty('value_col') ? config[di.value_col] : config[di]);
            });
        } else {
            flat_cols.push(d.hasOwnProperty('value_col') ? config[d.value_col] : config[d]);
        }
    });

    //merge in the derived columns
    return d3.merge([flat_cols, derived_cols]);
}
