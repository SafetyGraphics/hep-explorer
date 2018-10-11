export function addFootnote() {
    this.wrap
        .append('div')
        .attr('class', 'footnote')
        .text('Use controls to update chart or click a point to see participant details.')
        .style('font-size', '0.7em')
        .style('padding-top', '0.1em');
}
