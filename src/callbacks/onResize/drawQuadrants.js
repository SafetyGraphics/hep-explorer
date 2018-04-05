export function drawQuadrants() {
    var config = this.config;
    //position for cut-point lines
    this.config.quadrants.cut_lines
        .filter(d => d.dimension == 'x')
        .attr('x1', this.x(config.quadrants.cut_data.x))
        .attr('x2', this.x(config.quadrants.cut_data.x))
        .attr('y1', this.plot_height)
        .attr('y2', 0);

    this.config.quadrants.cut_lines
        .filter(d => d.dimension == 'y')
        .attr('x1', 0)
        .attr('x2', this.plot_width)
        .attr('y1', d => this.y(config.quadrants.cut_data.y))
        .attr('y2', d => this.y(config.quadrants.cut_data.y));

    this.config.quadrants.cut_lines_backing
        .filter(d => d.dimension == 'x')
        .attr('x1', this.x(config.quadrants.cut_data.x))
        .attr('x2', this.x(config.quadrants.cut_data.x))
        .attr('y1', this.plot_height)
        .attr('y2', 0);

    this.config.quadrants.cut_lines_backing
        .filter(d => d.dimension == 'y')
        .attr('x1', 0)
        .attr('x2', this.plot_width)
        .attr('y1', d => this.y(config.quadrants.cut_data.y))
        .attr('y2', d => this.y(config.quadrants.cut_data.y));

    //position labels
    this.config.quadrants.group_labels
        .select('text.upper-right')
        .attr('x', this.plot_width)
        .attr('y', 0);

    this.config.quadrants.group_labels
        .select('text.upper-left')
        .attr('x', 0)
        .attr('y', 0);

    this.config.quadrants.group_labels
        .select('text.lower-right')
        .attr('x', this.plot_width)
        .attr('y', this.plot_height);

    this.config.quadrants.group_labels
        .select('text.lower-left')
        .attr('x', 0)
        .attr('y', this.plot_height);

    this.config.quadrants.group_labels
        .selectAll('text')
        .attr('display', d => (d.count == 0 ? 'none' : null))
        .text(d => d.label + ' (' + d.percent + ')');
}
