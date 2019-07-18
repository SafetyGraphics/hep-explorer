export function setPointOpacity() {
    var chart = this;
    var config = this.config;
    var points = this.marks[0].circles;

    points.attr('fill-opacity', function(d) {
        var raw = d.values.raw[0];
        if (chart.plot_max_values) {
            // if viewing max values, fill based on time window
            return raw.day_diff <= config.visit_window ? 1 : 0;
        } else {
            //fill points after participants first day
            return config.plot_day < raw.day_range[0] ? 0 : 1;
        }
    });
}
