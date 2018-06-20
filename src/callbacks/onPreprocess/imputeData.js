import { imputeColumn } from './imputeData/imputeColumn';

export function imputeData() {
    var chart = this,
        config = this.config;

    //Remove missing values via the ultimate number regular expression.
    this.imputed_data = this.initial_data.filter(d =>
        /^-?(\d*\.?\d+|\d+\.?\d*)(E-?\d+)?$/.test(d[this.config.value_col])
    );
    this.imputed_data.forEach(function(d) {
        d.impute_flag = false;
    });

    config.measure_details.forEach(function(measure_settings) {
        var values = chart.imputed_data
                .filter(f => f[config.measure_col] == measure_settings.measure)
                .map(m => +m[config.value_col])
                .sort((a, b) => a - b),
            minValue = d3.min(values.filter(f => f > 0)), //minimum value > 0
            llod = null,
            imputed_value = null,
            drop = null;

        if (measure_settings.imputation == 'data-driven') {
            llod = minValue;
            imputed_value = minValue / 2;
            drop = false;
        } else if (measure_settings.imputation == 'user-defined') {
            llod = measure_settings.imputation_value;
            imputed_value = measure_settings.imputation_value / 2;
            drop = false;
        } else if (measure_settings.imputation == 'drop') {
            llod = null;
            imputed_value = null;
            drop = true;
        }
        chart.imputed_data = imputeColumn(
            chart.imputed_data,
            config.measure_col,
            config.value_col,
            measure_settings.measure,
            llod,
            imputed_value,
            drop
        );

        var total_imputed = d3.sum(chart.raw_data, f => (f.impute_flag ? 1 : 0));
    });
}
