export function formatPoints() {
    var chart = this;
    var config = this.config;
    var points = this.svg.selectAll('g.point').select('circle');

    points
        .attr('fill', function(d) {
            var raw = d.values.raw[0],
                pointColor = chart.colorScale(raw[config.color_by]);
            return raw.baselineFlag ? pointColor : 'white';
        })
        .attr('stroke', function(d) {
            var disabled = d3.select(this).classed('disabled');
            var raw = d.values.raw[0],
                pointColor = chart.colorScale(raw[config.color_by]);
            return disabled ? '#ccc' : pointColor;
        })
        .attr('fill-opacity', function(d) {
            var disabled = d3.select(this).classed('disabled');
            return disabled ? 0 : 0.5;
        })
        .attr('stroke-width', 1);
}
