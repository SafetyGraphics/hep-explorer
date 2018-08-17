import { updateQuadrantData } from '../../onDraw/updateQuadrantData';
import { drawQuadrants } from '../drawQuadrants';

export function dragEnded() {
    var chart = d3.select(this).datum().chart;

    d3
        .select(this)
        .select('line.cut-line')
        .attr('stroke-width', '1')
        .attr('stroke-dasharray', '5,5');
    chart.quadrant_labels.g.style('display', null);

    //redraw the chart (updates the needed cutpoint settings and quadrant annotations)
    chart.draw();
}
