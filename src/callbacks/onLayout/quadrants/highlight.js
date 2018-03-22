import { clearRugs } from '../../onResize/addPointMouseover/clearRugs';

export function highlight(d, chart) {
    //clear rugs if any
    clearRugs.call(chart, 'x');
    clearRugs.call(chart, 'y');

    //reset point stroke
    chart.marks[0].circles.attr('stroke-width', 1);

    //highlight points in the quadrant
    d3.select(this).attr('fill', 'black');
    var matches = chart.marks[0].circles.filter(f => f.values.raw[0].eDISH_quadrant == d.dataValue);
    matches.attr('stroke-width', 2);
}
