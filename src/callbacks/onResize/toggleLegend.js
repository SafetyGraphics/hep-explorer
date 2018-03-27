export function toggleLegend() {
    var hideLegend = this.config.color_by == 'NONE';
    this.wrap.select('.legend').style('display', hideLegend ? 'None' : null);
}
