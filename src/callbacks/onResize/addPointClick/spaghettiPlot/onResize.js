import drawCutLine from './onResize/drawCutLine';

export default function onResize() {
    var spaghetti = this;
    var config = this.config;

    //hide circles not above the cut point
    const y_col = this.config.y.column;
    this.marks[1].circles
        .attr('stroke-opacity', function(d) {
            return d.values.raw[0][y_col + '_flagged'] ? 1 : 0;
        })
        .attr('fill-opacity', function(d) {
            return d.values.raw[0][y_col + '_flagged'] ? 1 : 0;
        });

    this.marks[1].circles
        .on('mouseover', function(d) {
            drawCutLine.call(spaghetti, d);
        })
        .on('mouseout', function() {
            spaghetti.cutLine.remove();
            spaghetti.cutLabel.remove();
        });

    this.marks[0].paths
        .on('mouseover', function(d) {
            drawCutLine.call(spaghetti, d);
        })
        .on('mouseout', function() {
            spaghetti.cutLine.remove();
            spaghetti.cutLabel.remove();
        });
}
