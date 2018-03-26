export function addTitle() {
    var chart = this;
    var config = this.config;
    var points = this.marks[0].circles;

    points.append('title').text(function(d) {
        var raw = d.values.raw[0],
            xLabel =
                config.x.label +
                ': ' +
                d3.format('0.2f')(raw['ALT_absolute']) +
                ' ' +
                raw['ALT_absolute_unit'] +
                ' (' +
                d3.format('0.2f')(raw['ALT_relative']) +
                ' ' +
                raw['ALT_relative_unit'] +
                ')' +
                ' @ V' +
                raw['ALT_' + config.display + '_visitn'],
            yLabel =
                config.y.label +
                ': ' +
                d3.format('0.2f')(raw['TB_absolute']) +
                ' ' +
                raw['TB_absolute_unit'] +
                ' (' +
                d3.format('0.2f')(raw['TB_relative']) +
                ' ' +
                raw['TB_relative_unit'] +
                ')' +
                ' @ V' +
                raw['TB_' + config.display + '_visitn'];
        return xLabel + '\n' + yLabel;
    });
}
