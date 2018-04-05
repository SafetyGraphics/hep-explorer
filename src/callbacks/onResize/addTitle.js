export function addTitle() {
    var chart = this;
    var config = this.config;
    var points = this.marks[0].circles;

    points.append('title').text(function(d) {
        var raw = d.values.raw[0],
            xLabel =
                config.x.label +
                ': ' +
                d3.format('0.2f')(raw['ALT']) +
                ' @ V' +
                raw['ALT_' + config.visitn_col],
            yLabel =
                config.y.label +
                ': ' +
                d3.format('0.2f')(raw['TB']) +
                ' @ V' +
                raw['TB_' + config.visitn_col];
        return xLabel + '\n' + yLabel;
    });
}
