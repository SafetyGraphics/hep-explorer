export function addTitle() {
    var chart = this;
    var config = this.config;
    var points = this.marks[0].circles;
    points.select('title').remove();
    points.append('title').text(function(d) {
        var xvar = config.measure_details.find(f => f.axis == 'x').label;
        var yvar = config.measure_details.find(f => f.axis == 'y').label;
        var raw = d.values.raw[0],
            xLabel =
                config.x.label +
                ': ' +
                d3.format('0.2f')(raw[xvar]) +
                ' @ V' +
                raw[xvar + '_' + config.visitn_col] +
                ' (Day ' +
                raw[xvar + '_' + config.studyday_col] +
                ')',
            yLabel =
                config.y.label +
                ': ' +
                d3.format('0.2f')(raw[yvar]) +
                ' @ V' +
                raw[yvar + '_' + config.visitn_col] +
                ' (Day ' +
                raw[yvar + '_' + config.studyday_col] +
                ')',
            dayDiff = raw['day_diff'] + ' days apart';
        return xLabel + '\n' + yLabel + '\n' + dayDiff;
    });
}
