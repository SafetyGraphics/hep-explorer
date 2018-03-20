import { clearRugs } from './addPointMouseover/clearRugs';
import { drawRugs } from './addPointMouseover/drawRugs';
import { drawVisitPath } from './addPointMouseover/drawVisitPath';

export function addPointMouseover() {
    var chart = this;
    var config = this.config;

    //add event listener to all participant level points
    this.marks[0].circles.on('mouseover', function(d) {
        chart.marks[0].circles.attr('stroke-width', 1);
        d3.select(this).attr('stroke-width', 2);

        //only needed if mouseout didn't trigger - might be ok to delete
        clearRugs.call(chart, 'x');
        clearRugs.call(chart, 'y');

        //draw the rugs
        drawRugs.call(chart, d, 'x');
        drawRugs.call(chart, d, 'y');

        //drawVisitPath
        drawVisitPath.call(chart, d);
    });
}
