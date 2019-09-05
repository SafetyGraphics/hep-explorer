export function setPointOpacity() {
    var chart = this;
    var config = this.config;
    var points = this.marks[0].circles;

    points.attr('fill-opacity', function(d) {
        var raw = d.values.raw[0];
        if (config.plot_max_values) {
            // if viewing max values, fill based on time window
            return raw.day_diff <= config.visit_window ? 0.5 : 0;
        } else {
            //fill points after participant's first day
            return config.plot_day < raw.day_range[0] ? 0 : 0.5;
        }
    });
}
