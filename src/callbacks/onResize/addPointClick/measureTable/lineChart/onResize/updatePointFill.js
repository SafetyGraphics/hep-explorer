export function updatePointFill() {
    var points = this.marks[1].circles;
    points.attr('fill-opacity', function(d) {
        var outlier = d.values.raw[0].outlier;
        return outlier ? 1 : 0;
    });
}
