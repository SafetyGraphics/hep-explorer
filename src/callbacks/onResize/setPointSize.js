export function setPointSize() {
    var chart = this;
    var config = this.config;
    var points = this.svg.selectAll('g.point').select('circle');

    if (config.point_size == 'Time Between Measures' || config.point_size == 'Maximum ALP') {
        //Set the size variable
        var size_col = null;
        if (config.point_size == 'Time Between Measures') {
            size_col = 'day_diff';
        } else if (config.point_size == 'Maximum ALP') {
            size_col = 'ALP';
        }

        //create the scale
        var sizeScale = d3.scale
            .linear()
            .range(config.point_size == 'Time Between Measures' ? [10, 0] : [0, 10])
            .domain(d3.extent(chart.raw_data.map(m => m[size_col])));

        //draw the legend

        //set the point radius
        points.transition().attr('r', function(d) {
            var raw = d.values.raw[0];
            return sizeScale(raw[size_col]);
        });
    }
}
