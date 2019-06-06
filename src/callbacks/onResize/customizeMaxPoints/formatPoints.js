export function formatPoints() {
    var chart = this;
    var config = this.config;
    var points = this.svg
        .select('g.point-supergroup.mark1')
        .selectAll('g.point')
        .select('circle');

    points
        .attr('stroke', function(d) {
            var disabled = d3.select(this).classed('disabled');
            var raw = d.values.raw[0],
                pointColor = chart.colorScale(raw[config.color_by]);
            return disabled ? '#ccc' : pointColor;
        })
        .attr('fill', function(d) {
            var disabled = d3.select(this).classed('disabled');
            var raw = d.values.raw[0],
                pointColor = chart.colorScale(raw[config.color_by]);
            return disabled ? 'white' : pointColor;
        })
        .attr('stroke-width', 1)
        .style('clip-path', null);
}
