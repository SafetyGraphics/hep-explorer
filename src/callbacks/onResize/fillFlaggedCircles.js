export function fillFlaggedCircles() {
    var chart = this;
    var config = this.config;
    var points = this.svg.selectAll('g.point').select('circle');

    points.attr('fill', function(d) {
        var raw = d.values.raw[0],
            pointColor = chart.colorScale(raw[config.color_by]);
        return raw.baselineFlag ? pointColor : 'white';
    });
}
