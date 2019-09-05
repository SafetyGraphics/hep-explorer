import { clearParticipantDetails } from './clearParticipantDetails';
import { drawVisitPath } from './addPointClick/visitPath/drawVisitPath';
import { drawMeasureTable } from './addPointClick/measureTable/drawMeasureTable';
import { makeParticipantHeader } from './addPointClick/participantHeader/makeParticipantHeader';
import { drawRugs } from './addPointMouseover/drawRugs';
import { init as initSpaghettiPlot } from './addPointClick/spaghettiPlot/init';
import { init as initRRatioPlot } from './addPointClick/rRatioPlot/init';

export function addPointClick() {
    var chart = this;
    var config = this.config;
    var points = this.marks[0].circles;

    //add event listener to all participant level points
    points.on('click', function(d) {
        //Stop animation.
        chart.svg.transition().duration(0);
        chart.controls.studyDayPlayButton.datum({ state: 'play' });
        chart.controls.studyDayPlayButton.html('&#9658;');

        // Reset the details view
        clearParticipantDetails.call(chart, d); //clear the previous participant
        chart.config.quadrants.table.wrap.style('display', 'none'); //hide the quadrant summary

        //Update chart object & trigger the participantsSelected event on the overall chart.
        chart.participantsSelected = [d.key];
        chart.events.participantsSelected.data = chart.participantsSelected;
        chart.wrap.node().dispatchEvent(chart.events.participantsSelected);

        //format the eDish chart
        points
            .attr('stroke', '#ccc') //set all points to gray
            .attr('fill', 'white')
            .classed('disabled', true); //disable mouseover while viewing participant details

        d3.select(this)
            .attr('stroke', d => chart.colorScale(d.values.raw[0][config.color_by])) //highlight selected point
            .attr('stroke-width', 3);

        //Add elements to the eDish chart
        drawVisitPath.call(chart, d); //draw the path showing participant's pattern over time
        drawRugs.call(chart, d, 'x');
        drawRugs.call(chart, d, 'y');

        //draw the "detail view" for the clicked participant
        chart.participantDetails.wrap.selectAll('*').style('display', null);
        makeParticipantHeader.call(chart, d);
        initSpaghettiPlot.call(chart, d); //NOTE: the measure table is initialized from within the spaghettiPlot
        initRRatioPlot.call(chart, d);
    });
}
