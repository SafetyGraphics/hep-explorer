export function drawPopulationExtent() {
    var lineChart = this;

    this.svg
        .selectAll('line.guidelines')
        .data(lineChart.raw_data[0].population_extent)
        .enter()
        .append('line')
        .attr('class', 'guidelines')
        .attr('x1', 0)
        .attr('x2', lineChart.plot_width)
        .attr('y1', d => lineChart.y(d))
        .attr('y2', d => lineChart.y(d))
        .attr('stroke', '#ccc')
        .attr('stroke-dasharray', '2 2');
}
