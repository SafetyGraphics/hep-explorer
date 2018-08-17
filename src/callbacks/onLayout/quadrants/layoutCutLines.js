export function layoutCutLines() {
    var chart = this;
    var config = chart.config;
    var quadrants = this.config.quadrants;

    //////////////////////////////////////////////////////////
    //layout the cut lines
    /////////////////////////////////////////////////////////
    chart.cut_lines = {};
    chart.cut_lines.wrap = this.svg.append('g').attr('class', 'cut-lines');
    var wrap = chart.cut_lines.wrap;

    //slight hack to make life easier on drag
    var cutLineData = [{ dimension: 'x' }, { dimension: 'y' }];

    cutLineData.forEach(function(d) {
        d.chart = chart;
    });

    chart.cut_lines.g = wrap
        .selectAll('g.cut')
        .data(cutLineData)
        .enter()
        .append('g')
        .attr('class', d => 'cut ' + d.dimension);

    chart.cut_lines.lines = chart.cut_lines.g
        .append('line')
        .attr('class', 'cut-line')
        .attr('stroke-dasharray', '5,5')
        .attr('stroke', '#bbb');

    chart.cut_lines.backing = chart.cut_lines.g
        .append('line')
        .attr('class', 'cut-line-backing')
        .attr('stroke', 'transparent')
        .attr('stroke-width', '10')
        .attr('cursor', 'move');
}
