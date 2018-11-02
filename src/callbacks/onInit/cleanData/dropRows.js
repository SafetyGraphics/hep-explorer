export default function dropRows() {
    var chart = this;
    var config = this.config;
    this.dropped_rows = [];

    /////////////////////////
    // Remove invalid rows
    /////////////////////////
    var numerics = ['value_col', 'studyday_col', 'normal_col_low', 'normal_col_high'];
    chart.imputed_data = chart.initial_data.filter(f => true);
    numerics.forEach(function(setting) {
        chart.imputed_data = chart.imputed_data.filter(d => {
            //Remove non-numeric value_col
            var numericCol = /^-?(\d*\.?\d+|\d+\.?\d*)(E-?\d+)?$/.test(d[config[setting]]);
            if (!numericCol) {
                d.dropReason = `${setting} Column ("${config[setting]}") is not numeric.`;
                chart.dropped_rows.push(d);
            }
            return numericCol;
        });
    });
}
