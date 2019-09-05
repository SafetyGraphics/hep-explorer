export default function drawCutLines() {
    var chart = this;
    var config = this.config;

    //line at R Ratio = 2
    chart.svg
        .append('line')
        .attr('y1', chart.y(2))
        .attr('y2', chart.y(2))
        .attr('x1', 0)
        .attr('x2', chart.plot_width)
        .attr('stroke', '#999')
        .attr('stroke-dasharray', '3 3');

    chart.svg
        .append('text')
        .attr('y', chart.y(2))
        .attr('dy', '-0.2em')
        .attr('x', chart.plot_width)
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'baseline')
        .attr('fill', '#999')
        .text('2');

    //line at R Ratio = 5
    chart.svg
        .append('line')
        .attr('y1', chart.y(5))
        .attr('y2', chart.y(5))
        .attr('x1', 0)
        .attr('x2', chart.plot_width)
        .attr('stroke', '#999')
        .attr('stroke-dasharray', '3 3');

    chart.svg
        .append('text')
        .attr('y', chart.y(5))
        .attr('dy', '-0.2em')
        .attr('x', chart.plot_width)
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'baseline')
        .attr('fill', '#999')
        .text('5');
}
