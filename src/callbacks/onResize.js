import { drawQuadrants } from './onResize/drawQuadrants';
import { updateSummaryTable } from './onLayout/quadrants/updateSummaryTable';
import { addPointMouseover } from './onResize/addPointMouseover';
import { addPointClick } from './onResize/addPointClick';
import { addTitle } from './onResize/addTitle';
import { toggleLegend } from './onResize/toggleLegend';
import { init as addLineDrag } from './onResize/addLineDrag/init';
import { fillFlaggedCircles } from './onResize/fillFlaggedCircles';

export default function onResize() {
    //add point interactivity, custom title and formatting
    addPointMouseover.call(this);
    addPointClick.call(this);
    addTitle.call(this);
    fillFlaggedCircles.call(this);

    //draw the quadrants and add drag interactivity
    updateSummaryTable.call(this);
    drawQuadrants.call(this);
    addLineDrag.call(this);

    // hide the legend if no group options are given
    toggleLegend.call(this);
}
