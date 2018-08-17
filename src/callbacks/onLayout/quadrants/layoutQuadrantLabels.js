export function layoutQuadrantLabels() {
    var chart = this;
    var config = chart.config;
    var quadrants = this.config.quadrants;

    //////////////////////////////////////////////////////////
    //layout the quadrant labels
    /////////////////////////////////////////////////////////

    chart.quadrant_labels = {};
    chart.quadrant_labels.g = this.svg.append('g').attr('class', 'quadrant-labels');

    chart.quadrant_labels.text = chart.quadrant_labels.g
        .selectAll('text.quadrant-label')
        .data(quadrants)
        .enter()
        .append('text')
        .attr('class', d => 'quadrant-label ' + d.position)
        .attr('dy', d => (d.position.search('lower') > -1 ? '-.2em' : '.5em'))
        .attr('dx', d => (d.position.search('right') > -1 ? '-.5em' : '.5em'))
        .attr('text-anchor', d => (d.position.search('right') > 0 ? 'end' : null))
        .attr('fill', '#bbb')
        .text(d => d.label);
}
