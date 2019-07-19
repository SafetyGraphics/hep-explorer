export function addPointTitles() {
    var chart = this;
    var config = this.config;
    var points = this.marks[0].circles;
    points.select('title').remove();
    points.append('title').text(function(d) {
        var xvar = config.x.column;
        var yvar = config.y.column;
        var raw = d.values.raw[0],
            xLabel =
                config.x.label +
                ': ' +
                d3.format('0.2f')(raw[xvar]) +
                ' @  Day ' +
                raw[xvar + '_' + config.studyday_col],
            yLabel =
                config.y.label +
                ': ' +
                d3.format('0.2f')(raw[yvar]) +
                ' @ Day ' +
                raw[yvar + '_' + config.studyday_col],
            dayDiff = raw['day_diff'] + ' days apart',
            idLabel = 'Participant ID: ' + raw[config.id_col],
            rRatioLabel = config.r_ratio_filter
                ? '\n' + 'R Ratio: ' + d3.format('0.2f')(raw.rRatio)
                : '';
        return idLabel + rRatioLabel + '\n' + xLabel + '\n' + yLabel + '\n' + dayDiff;
    });
}
