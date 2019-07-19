export function drawQuadrants() {
    var config = this.config;
    const x_var = this.config.x.column;
    const y_var = this.config.y.column;

    const x_cut = this.config.cuts[x_var][config.display];
    const y_cut = this.config.cuts[y_var][config.display];

    //position for cut-point lines
    this.cut_lines.lines
        .filter(d => d.dimension == 'x')
        .attr('x1', this.x(x_cut))
        .attr('x2', this.x(x_cut))
        .attr('y1', this.plot_height)
        .attr('y2', 0);

    this.cut_lines.lines
        .filter(d => d.dimension == 'y')
        .attr('x1', 0)
        .attr('x2', this.plot_width)
        .attr('y1', d => this.y(y_cut))
        .attr('y2', d => this.y(y_cut));

    this.cut_lines.backing
        .filter(d => d.dimension == 'x')
        .attr('x1', this.x(x_cut))
        .attr('x2', this.x(x_cut))
        .attr('y1', this.plot_height)
        .attr('y2', 0);

    this.cut_lines.backing
        .filter(d => d.dimension == 'y')
        .attr('x1', 0)
        .attr('x2', this.plot_width)
        .attr('y1', d => this.y(y_cut))
        .attr('y2', d => this.y(y_cut));

    //position labels
    this.quadrant_labels.g.attr('display', null); //show labels if they're hidden
    this.quadrant_labels.g
        .select('text.upper-right')
        .attr('x', this.plot_width)
        .attr('y', 0);

    this.quadrant_labels.g
        .select('text.upper-left')
        .attr('x', 0)
        .attr('y', 0);

    this.quadrant_labels.g
        .select('text.lower-right')
        .attr('x', this.plot_width)
        .attr('y', this.plot_height);

    this.quadrant_labels.g
        .select('text.lower-left')
        .attr('x', 0)
        .attr('y', this.plot_height);

    this.quadrant_labels.text.text(d => d.label + ' (' + d.percent + ')');
}
