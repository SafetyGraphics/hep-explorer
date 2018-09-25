export function addFootnote() {
    var footnoteText = [
        'Y-Axis for each chart is based on the range of values for the entire population. Points shown for values outside the normal range. Click a sparkline to see a larger version of the chart.'
    ];
    var footnotes = this.wrap.selectAll('span.footnote').data(footnoteText, d => d);

    footnotes
        .enter()
        .append('span')
        .attr('class', 'footnote')
        .style('font-size', '0.7em')
        .style('padding-top', '0.1em')
        .text(d => d);

    footnotes.exit().remove();
}
