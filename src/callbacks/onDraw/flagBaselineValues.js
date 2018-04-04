export function flagBaselineValues() {
    var config = this.config,
        baseline_data = this.initial_data.filter(
            f => f[config.visitn_col] == config.baseline_visitn
        ),
        meaure_obj = config.measure_details.find(f => f.axis == 'z'),
        cut_value = meaure_obj.cut[config.display],
        cut_variable = meaure_obj.measure,
        flagged_ids = baseline_data
            .filter(f => f[config.measure_col] == cut_variable)
            .filter(f => f[config.value_col] >= cut_value)
            .map(m => m[config.id_col]);

    //add flag to flattened_data
    this.raw_data.forEach(function(d) {
        d.baselineFlag = flagged_ids.indexOf(d[config.id_col]) > -1;
    });
}
