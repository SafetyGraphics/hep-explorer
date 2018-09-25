export function addFootnote() {
    this.wrap
        .append('span')
        .style('font-size', '0.7em')
        .style('padding-top', '0.1em')
        .text(
            'Y-Axis for each chart is based on the range of values for the entire population. Values outside the normal range are shown in orange. Click a sparkline to see a larger version of the chart.'
        );
}
