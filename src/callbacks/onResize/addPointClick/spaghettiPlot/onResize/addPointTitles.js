export default function addPointTitles() {
    var spaghetti = this;
    var config = this.edish.config;
    var points = this.marks[1].circles;
    points.select('title').remove();
    points.append('title').text(function(d) {
        var raw = d.values.raw[0];
        var ylabel = spaghetti.config.displayLabel;
        var yvar = spaghetti.config.y.column;
        const studyday_label = 'Study day: ' + raw[config.studyday_col] + '\n',
            visitn_label = config.visitn_col
                ? 'Visit Number: ' + raw[config.visitn_col] + '\n'
                : '',
            visit_label = config.visit_col ? 'Visit: ' + raw[config.visit_col] + '\n' : '',
            raw_label =
                'Raw ' +
                raw[config.measure_col] +
                ': ' +
                d3.format('0.3f')(raw[config.value_col]) +
                '\n',
            adj_label = 'Adjusted ' + raw[config.measure_col] + ': ' + d3.format('0.3f')(raw[yvar]);
        return studyday_label + visit_label + visitn_label + raw_label + adj_label;
    });
}
