// Reposition any exisiting participant marks when the chart is resized
export function updateParticipantMarks() {
    var chart = this;
    var config = this.config;

    //reposition participant visit path
    var myNewLine = d3.svg
        .line()
        .x(d => chart.x(d.x))
        .y(d => chart.y(d.y));

    chart.visitPath
        .select('path')
        .transition()
        .attr('d', myNewLine);

    //reposition participant visit circles and labels
    chart.visitPath
        .selectAll('g.visit-point')
        .select('circle')
        .transition()
        .attr('cx', d => chart.x(d.x))
        .attr('cy', d => chart.y(d.y));

    chart.visitPath
        .selectAll('g.visit-point')
        .select('text.participant-visits')
        .transition()
        .attr('x', d => chart.x(d.x))
        .attr('y', d => chart.y(d.y));

    //reposition axis rugs
    chart.x_rug
        .selectAll('text')
        .transition()
        .attr('x', d => chart.x(d[config.display]))
        .attr('y', d => chart.y(chart.y.domain()[0]));

    chart.y_rug
        .selectAll('text')
        .transition()
        .attr('x', d => chart.x(chart.x.domain()[0]))
        .attr('y', d => chart.y(d[config.display]));
}
