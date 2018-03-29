import { clearVisitPath } from './addPointClick/clearVisitPath';
import { clearParticipantHeader } from './addPointClick/clearParticipantHeader';
import { hideMeasureTable } from './addPointClick/hideMeasureTable';
import { clearRugs } from './addPointMouseover/clearRugs';
import { fillFlaggedCircles } from './fillFlaggedCircles';

export function clearParticipantDetails() {
    var chart = this;
    var config = this.config;

    this.svg
        .selectAll('g.point')
        .select('circle')
        .attr('stroke', function(d) {
            return chart.colorScale(d.values.raw[0][config.color_by]);
        }) //reset point colors
        .attr('fill-opacity', 0.5)
        .attr('stroke-width', 1); //reset stroke
    this.config.quadrants.table.wrap.style('display', null);
    clearVisitPath.call(this); //remove path
    clearParticipantHeader.call(this);
    clearRugs.call(this, 'x'); //clear rugs
    clearRugs.call(this, 'y');
    hideMeasureTable.call(this); //remove the detail table
}
