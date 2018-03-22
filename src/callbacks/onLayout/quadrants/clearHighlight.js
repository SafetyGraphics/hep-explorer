export function clearHighlight(chart) {
    d3.select(this).attr('fill', '#bbb');
    chart.marks[0].circles.attr('stroke-width', 1);
}
