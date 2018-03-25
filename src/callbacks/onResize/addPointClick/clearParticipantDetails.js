import { clearVisitPath } from './clearVisitPath';

export function clearParticipantDetails(d) {
    var chart = this;
    var config = this.config;
    var points = this.marks[0].circles;

    points
        .attr('stroke', d => chart.colorScale(d[config.color_by])) //reset point colors
        .attr('stroke-width', 1); //reset stroke

    clearVisitPath.call(this, d); //remove path

    //remove the detail table
}
