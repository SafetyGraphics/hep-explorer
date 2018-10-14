export function dragStarted() {
    var dimension = d3.select(this).classed('x') ? 'x' : 'y';
    var chart = d3.select(this).datum().chart;

    d3.select(this)
        .select('line.cut-line')
        .attr('stroke-width', '2')
        .attr('stroke-dasharray', '2,2');

    chart.quadrant_labels.g.style('display', 'none');
}
