export default function addPointTitles() {
    var rrplot = this;
    var config = this.edish.config;
    var points = this.marks[1].circles;
    points.select('title').remove();
    points.append('title').text(function(d) {
        var raw = d.values.raw[0];

        const studyday_label = 'Study day: ' + raw[config.studyday_col] + '\n',
            visitn_label = config.visitn_col
                ? 'Visit Number: ' + raw[config.visitn_col] + '\n'
                : '',
            visit_label = config.visit_col ? 'Visit: ' + raw[config.visit_col] + '\n' : '',
            rratio_label = 'R Ratio: ' + d3.format('0.2f')(raw.rRatio);
        return studyday_label + visit_label + visitn_label + rratio_label;
    });
}
