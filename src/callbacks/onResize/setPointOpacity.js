export function setPointOpacity() {
    var chart = this;
    var config = this.config;
    var points = this.svg.selectAll('g.point').select('circle');
    points.attr('fill-opacity', d => (d.values.raw[0].day_diff <= config.visit_window ? 1 : 0)); //fill points in visit_window
}
