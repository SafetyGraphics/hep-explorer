export function setPointOpacity() {
    var chart = this;
    var config = this.config;
    var points = this.svg.selectAll('g.point').select('circle');
    if (config.point_opacity) {
        //create opacity scale
        var opacityScale = d3.scale
            .linear()
            .range([1, 0])
            .domain(d3.extent(chart.raw_data.map(m => m.day_diff)));

        //set the opacity
        points.attr('fill-opacity', d => opacityScale(d.values.raw[0].day_diff));
    }
}
