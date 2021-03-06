export function drawNormalRange() {
    var lineChart = this;
    var upper = this.raw_data.map(function(m) {
        return { studyday: m.studyday, value: m.uln };
    });
    var lower = this.raw_data
        .map(function(m) {
            return { studyday: m.studyday, value: m.lln };
        })
        .reverse();
    var normal_data = d3.merge([upper, lower]).filter(f => f.value || f.value == 0);
    var drawnormal = d3.svg
        .line()
        .x(d => lineChart.x(d.studyday))
        .y(d => lineChart.y(d.value));
    var normalpath = this.svg
        .append('path')
        .datum(normal_data)
        .attr({
            class: 'normalrange',
            d: drawnormal,
            fill: '#eee',
            stroke: 'none'
        });
    normalpath.moveToBack();
}
