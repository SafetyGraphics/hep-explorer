export function addFootnote() {
    var footnoteText = [
        `The y-axis for each chart is set to the ${this.edish.config.measureBounds
            .map(bound => {
                const percentile = '' + Math.round(bound * 100);
                const lastDigit = +percentile.substring(percentile.length - 1);
                const text =
                    percentile +
                    ([0, 4, 5, 6, 7, 8, 9].indexOf(lastDigit) > -1
                        ? 'th'
                        : lastDigit === 3
                        ? 'rd'
                        : lastDigit === 2
                        ? 'nd'
                        : 'st');
                return text;
            })
            .join(' and ')} percentiles of the entire population's results for that measure. ` +
            `Values outside the normal range are plotted as individual points. ` +
            `Click a sparkline to view a more detailed version of the chart.`
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
