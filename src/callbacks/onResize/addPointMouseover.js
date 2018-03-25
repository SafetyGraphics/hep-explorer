import { clearRugs } from './addPointMouseover/clearRugs';
import { drawRugs } from './addPointMouseover/drawRugs';

export function addPointMouseover() {
    var chart = this;
    var config = this.config;
    var points = this.marks[0].circles;
    //add event listener to all participant level points
    points
        .filter(function(d) {
            var disabled = d3.select(this).classed('disabled');
            return !disabled;
        })
        .on('mouseover', function(d) {
            //disable mouseover when highlights (onClick) are visible
            var disabled = d3.select(this).classed('disabled');
            if (!disabled) {
                //clear previous mouseover if any
                points.attr('stroke-width', 1);
                clearRugs.call(chart, 'x');
                clearRugs.call(chart, 'y');

                //draw the rugs
                d3.select(this).attr('stroke-width', 3);
                drawRugs.call(chart, d, 'x');
                drawRugs.call(chart, d, 'y');
            }
        });
}
