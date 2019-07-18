import drawCutLine from './onResize/drawCutLine';
import addPointTitles from './onResize/addPointTitles';
import addExposure from './onResize/addExposure';

export default function onResize() {
    var spaghetti = this;
    var config = this.config;

    addPointTitles.call(this);

    //fill circles above the cut point
    const y_col = this.config.y.column;
    this.marks[1].circles
        .attr('fill-opacity', function(d) {
            return d.values.raw[0][y_col + '_flagged'] ? 1 : 0;
        })
        .attr('fill-opacity', function(d) {
            return d.values.raw[0][y_col + '_flagged'] ? 1 : 0;
        });

    //Show  cut lines on mouseover
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

    //annotate treatment exposure
    addExposure.call(this);

    //embiggen clip-path so points aren't clipped
    const radius = this.config.marks.find(mark => mark.type === 'circle').radius;
    this.svg
        .select('.plotting-area')
        .attr('width', this.plot_width + radius * 2 + 2) // plot width + circle radius * 2 + circle stroke width * 2
        .attr('height', this.plot_height + radius * 2 + 2) // plot height + circle radius * 2 + circle stroke width * 2
        .attr(
            'transform',
            `translate(-${
                radius + 1 // translate left circle radius + circle stroke width
            },-${
                radius + 1 // translate up circle radius + circle stroke width
            })`
        );
}
