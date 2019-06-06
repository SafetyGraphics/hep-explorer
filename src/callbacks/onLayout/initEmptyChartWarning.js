export function initEmptyChartWarning() {
    this.emptyChartWarning = d3
        .select(this.element)
        .append('span')
        .text('No data selected. Try updating your settings or resetting the chart. ')
        .style('display', 'none')
        .style('color', '#a94442')
        .style('background-color', '#f2dede')
        .style('border', '1px solid #ebccd1')
        .style('padding', '0.5em')
        .style('margin', '0 2% 12px 2%')
        .style('border-radius', '0.2em');
}
