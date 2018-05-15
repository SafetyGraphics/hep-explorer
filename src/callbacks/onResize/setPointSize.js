export function setPointSize() {
    var chart = this;
    var config = this.config;
    var points = this.svg.selectAll('g.point').select('circle');
    if (config.point_size != 'Uniform') {
        //create the scale
        var sizeScale = d3.scale
            .linear()
            .range([2, 10])
            .domain(d3.extent(chart.raw_data.map(m => m[config.point_size])));

        //draw a legend (coming later?)

        //set the point radius
        points.transition().attr('r', function(d) {
            var raw = d.values.raw[0];
            return sizeScale(raw[config.point_size]);
        });
    }
}
