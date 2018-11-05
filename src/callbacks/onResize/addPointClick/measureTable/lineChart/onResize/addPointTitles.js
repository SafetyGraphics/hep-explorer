export function addPointTitles() {
    var config = this.edish.config;
    var points = this.marks[1].circles;
    points.select('title').remove();
    points.append('title').text(function(d) {
        console.log(d);
        var raw = d.values.raw[0];
        var xvar = config.x.column;
        var yvar = config.y.column;
        const studyday_label = 'Study day: ' + raw.studyday + '\n',
            visitn_label = raw.visitn ? 'Visit Number: ' + raw.visitn + '\n' : '',
            visit_label = raw.visit ? 'Visit: ' + raw.visit + '\n' : '',
            lab_label = raw.lab + ': ' + d3.format('0.3f')(raw.value);
        return studyday_label + visit_label + visitn_label + lab_label;
    });
}
