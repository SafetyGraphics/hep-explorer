export function formatPoints() {
    var chart = this;
    var config = this.config;
    var points = this.marks[0].circles;

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
        .attr('stroke-width', this.marks[0].attributes['stroke-width']);
}
