import { imputeColumn } from './imputeData/imputeColumn';

export default function imputeData() {
    const chart = this;
    const config = this.config;

    Object.keys(config.measure_values).forEach(function(measureKey) {
        var values = chart.imputed_data
                .filter(f => f[config.measure_col] == config.measure_values[measureKey])
                .map(m => +m[config.value_col])
                .sort((a, b) => a - b),
            minValue = d3.min(values.filter(f => f > 0)), //minimum value > 0
            llod = null,
            imputed_value = null,
            drop = null;

        if (config.imputation_methods[measureKey] == 'data-driven') {
            llod = minValue;
            imputed_value = minValue / 2;
            drop = false;
        } else if (config.imputation_methods[measureKey] == 'user-defined') {
            llod = config.imputation_values[measureKey];
            imputed_value = config.imputation_values[measureKey] / 2;
            drop = false;
        } else if (config.imputation_methods[measureKey] == 'drop') {
            llod = null;
            imputed_value = null;
            drop = true;
        }
        chart.imputed_data = imputeColumn(
            chart.imputed_data,
            config.measure_col,
            config.value_col,
            config.measure_values[measureKey],
            llod,
            imputed_value,
            drop
        );

        var total_imputed = d3.sum(chart.raw_data, f => (f.impute_flag ? 1 : 0));
    });
}
