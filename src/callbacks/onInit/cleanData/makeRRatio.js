export default function makeRRatio() {
    let chart = this;
    let config = this.config;
    //adds rows for rRatio and nrRatio to this.imputed_data

    let rRatio = d3
        .nest()
        .key(f => f[config.id_col] + '::' + f[config.studyday_col] + '::' + f[config.visitn_col])
        .rollup(function(d) {
            //get ALT, AST and ALP for each visit
            let alt_data = d.find(f => f[config.measure_col] == config.measure_values.ALT);
            let alt = alt_data ? alt_data.relative_uln : null;
            let alt_relative_baseline = alt_data ? alt_data.relative_baseline : null;

            let alp_data = d.find(f => f[config.measure_col] == config.measure_values.ALP);
            let alp = alp_data ? alp_data.relative_uln : null;
            let alp_relative_baseline = alp_data ? alp_data.relative_baseline : null;

            let rratio = alt === null || alp === null ? null : alt / alp;
            let rratio_relative_baseline =
                alt_relative_baseline === null || alp_relative_baseline === null
                    ? null
                    : alt_relative_baseline / alp_relative_baseline;

            //create object to return - keep the demographics, etc. overwrite measure-specific variables
            let obj = {};
            obj[config.id_col] = d[0][config.id_col];
            obj[config.studyday_col] = d[0][config.studyday_col];
            obj.analysisFlag = d[0].analysisFlag;
            obj.key_measure = true;

            obj[config.measure_col] = 'rRatio';
            obj[config.value_col] = rratio;
            obj[config.normal_col_low] = null;
            obj[config.normal_col_high] = null;
            obj.uln = null;

            obj.absolute = rratio; // NOTE: absolute doesn't really make sense, but this hack lets us use the relative values in visit-level plot.
            obj.relative_uln = rratio;
            obj.relative_baseline = rratio_relative_baseline;
            // note that the baseline calculation uses raw values and doesn't account for changes in ULN over the course of the study.
            return obj;
        })
        .entries(chart.imputed_data)
        .map(m => m.values)
        .filter(f => f.absolute || f.relative_baseline);

    let nrRatio = d3
        .nest()
        .key(f => f[config.id_col] + '::' + f[config.studyday_col] + '::' + f[config.visitn_col])
        .rollup(function(d) {
            //get ALT, AST and ALP for each visit
            let alt_data = d.find(f => f[config.measure_col] == config.measure_values.ALT);
            let alt = alt_data ? alt_data.relative_uln : null;
            let alt_relative_baseline = alt_data ? alt_data.relative_baseline : null;

            let alp_data = d.find(f => f[config.measure_col] == config.measure_values.ALP);
            let alp = alp_data ? alp_data.relative_uln : null;
            let alp_relative_baseline = alp_data ? alp_data.relative_baseline : null;

            let ast_data = d.find(f => f[config.measure_col] == config.measure_values.AST);
            let ast = ast_data ? ast_data.relative_uln : null;
            let ast_relative_baseline = ast_data ? ast_data.relative_baseline : null;

            let nrratio =
                Math.max(alt, ast) == null || alp == null ? null : Math.max(alt, ast) / alp;
            let nrratio_relative_baseline =
                Math.max(alt_relative_baseline, ast_relative_baseline) == null ||
                alp_relative_baseline == null
                    ? null
                    : Math.max(alt_relative_baseline, ast_relative_baseline) /
                      alp_relative_baseline;

            //create object to return - keep the demographics, etc. overwrite measure-specific variables

            let obj = {};
            obj.raw = d;
            obj[config.id_col] = d[0][config.id_col];
            obj[config.studyday_col] = d[0][config.studyday_col];
            obj.analysisFlag = d[0].analysisFlag;
            obj.key_measure = true;

            obj[config.measure_col] = 'nrRatio';
            obj[config.value_col] = nrratio;
            obj[config.normal_col_low] = null;
            obj[config.normal_col_high] = null;
            obj.uln = null;

            obj.absolute = nrratio; // NOTE: absolute doesn't really make sense, but this hack lets us use the relative values in visit-level plot.
            obj.relative_uln = nrratio;
            obj.relative_baseline = nrratio_relative_baseline;
            // note that the baseline calculation uses raw values and doesn't account for changes in ULN over the course of the study.
            return obj;
        })
        .entries(chart.imputed_data)
        .map(m => m.values)
        .filter(f => f.absolute || f.relative_baseline);

    this.imputed_data = d3.merge([this.imputed_data, rRatio, nrRatio]);
}
