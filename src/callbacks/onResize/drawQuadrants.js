export function drawQuadrants() {
    //position for cut-point lines
    this.quadrants.cut_lines
        .filter(d => d.dimension == 'x')
        .attr('x1', d => this.x(d.value))
        .attr('x2', d => this.x(d.value))
        .attr('y1', this.plot_height)
        .attr('y2', 0);

    this.quadrants.cut_lines
        .filter(d => d.dimension == 'y')
        .attr('x1', 0)
        .attr('x2', this.plot_width)
        .attr('y1', d => this.y(d.value))
        .attr('y2', d => this.y(d.value));

    //position labels
    this.quadrants.group_labels
        .select('text.upper-right')
        .attr('x', this.plot_width)
        .attr('y', 0);

    this.quadrants.group_labels
        .select('text.upper-left')
        .attr('x', 0)
        .attr('y', 0);

    this.quadrants.group_labels
        .select('text.lower-right')
        .attr('x', this.plot_width)
        .attr('y', this.plot_height);

    this.quadrants.group_labels
        .select('text.lower-left')
        .attr('x', 0)
        .attr('y', this.plot_height);

    this.quadrants.group_labels
        .selectAll('text')
        .attr('display', d => (d.count == 0 ? 'none' : null))
        .text(d => d.label + '(' + d.count + ')');
}
