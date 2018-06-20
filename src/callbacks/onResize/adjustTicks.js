export function adjustTicks() {
    this.svg
        .selectAll('.x.axis .tick text')
        .attr({
            transform: 'rotate(-45)',
            dx: -10,
            dy: 10
        })
        .style('text-anchor', 'end');
}
