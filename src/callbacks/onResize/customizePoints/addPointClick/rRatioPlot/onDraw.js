export default function() {
    var chart = this;
    var config = this.config;

    //make sure y domain includes the current cut point for all measures
    const max_value = d3.max(chart.filtered_data, f => f[chart.config.y.column]);
    const max_cut = 5;
    const y_max = d3.max([max_value, max_cut]);
    chart.config.y.domain = [0, y_max];
    chart.y_dom = chart.config.y.domain;
}
