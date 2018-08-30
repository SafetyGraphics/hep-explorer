export default function deriveVariables() {
    var chart = this;
    var config = this.config;

    //filter the lab data to only the required measures
    var included_measures = Object.values(config.measure_values);

    var sub = this.imputed_data
        .filter(f => included_measures.indexOf(f[config.measure_col]) > -1)
        .filter(f => true); //add a filter on selected visits here

    var missingBaseline = 0;
    this.imputed_data.forEach(function(d) {
        //coerce numeric values to number
        var numerics = ['value_col', 'visitn_col', 'normal_col_low', 'normal_col_high'];
        numerics.forEach(function(col) {
            d[config[col]] = +d[config[col]];
        });
        //standardize key variables
        d.key_measure = false;
        if (included_measures.indexOf(d[config.measure_col]) > -1) {
            d.key_measure = true;

            //map the raw value to a variable called 'absolute'
            d.absolute = d[config.value_col];

            //get the value relative to the ULN (% of the upper limit of normal) for the measure
            d.relative_uln = d[config.value_col] / d[config.normal_col_high];

            //get the value relative to baseline for the measure
            var baseline_record = sub
                .filter(f => d[config.id_col] == f[config.id_col])
                .filter(f => d[config.measure_col] == f[config.measure_col])
                .filter(f => f[config.visitn_col] == +config.baseline_visitn);

            if (baseline_record.length > 0) {
                d.baseline_absolute = baseline_record[0][config.value_col];
                if (d.baseline_absolute > 0) {
                    d.relative_baseline = d.absolute / d.baseline_absolute;
                } else {
                    missingBaseline = missingBaseline + 1;
                    d.relative_baseline = null;
                }
            } else {
                missingBaseline = missingBaseline + 1;
                d.baseline_absolute = null;
                d.relative_baseline = null;
            }
        }
    });

    if (missingBaseline > 0)
        console.warn(
            'No baseline value found for ' + missingBaseline + ' of ' + sub.length + ' records.'
        );
}
