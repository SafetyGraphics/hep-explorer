import { clearParticipantDetails } from './addPointClick/clearParticipantDetails';
import { drawVisitPath } from './addPointClick/drawVisitPath';

export function addPointClick() {
    var chart = this;
    var config = this.config;
    var points = this.marks[0].circles;

    //add event listener to all participant level points
    points.on('click', function(d) {
        clearParticipantDetails.call(chart, d); //clear the previous participant
        points
            .attr('stroke', '#ccc') //set all points to gray
            .classed('disabled', true); //disable mouseover while viewing participant details

        d3
            .select(this)
            .attr('stroke', d => chart.colorScale(d.values.raw[0][config.color_by])) //highlight selected point
            .attr('stroke-width', 3);

        drawVisitPath.call(chart, d); //draw the path showing participant's pattern over time

        //draw table showing measure values with sparklines
        //add clear details button
    });
}
