export default function hideEmptyChart() {
    const emptyChart = this.filtered_data.length == 0;
    this.wrap.style('display', emptyChart ? 'none' : 'inline-block');
    this.emptyChartWarning.style('display', emptyChart ? 'inline-block' : 'none');
}
