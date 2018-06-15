import { clearParticipantDetails } from './clearParticipantDetails';
import { drawVisitPath } from './addPointClick/drawVisitPath';
import { drawMeasureTable } from './addPointClick/drawMeasureTable';
import { makeParticipantHeader } from './addPointClick/makeParticipantHeader';
import { drawRugs } from './addPointMouseover/drawRugs';
import { draw as drawSpaghettiPlot } from './addPointClick/spaghettiPlot/draw';

export function addPointClick() {
    var chart = this;
    var config = this.config;
    var points = this.marks[0].circles;

    //add event listener to all participant level points
    points.on('click', function(d) {
        clearParticipantDetails.call(chart, d); //clear the previous participant
        chart.config.quadrants.table.wrap.style('display', 'none'); //hide the quadrant summart
        points
            .attr('stroke', '#ccc') //set all points to gray
            .attr('fill', 'white')
            .classed('disabled', true); //disable mouseover while viewing participant details

        d3
            .select(this)
            .attr('stroke', d => chart.colorScale(d.values.raw[0][config.color_by])) //highlight selected point
            .attr('stroke-width', 3);

        drawVisitPath.call(chart, d); //draw the path showing participant's pattern over time
        drawMeasureTable.call(chart, d); //draw table showing measure values with sparklines
        drawSpaghettiPlot.call(chart, d);
        makeParticipantHeader.call(chart, d);
        drawRugs.call(chart, d, 'x');
        drawRugs.call(chart, d, 'y');
    });
}
