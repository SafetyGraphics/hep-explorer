import customizePoints from './onResize/customizePoints';
import { drawQuadrants } from './onResize/drawQuadrants';
import { updateSummaryTable } from './onLayout/quadrants/updateSummaryTable';
import { addAxisLabelTitles } from './onResize/addAxisLabelTitles';
import { toggleLegend } from './onResize/toggleLegend';
import { init as addLineDrag } from './onResize/addLineDrag/init';
import { init as initBoxPlots } from './onResize/addBoxPlots/init';
import { adjustTicks } from './onResize/adjustTicks';
import updateTimingFootnote from './onResize/updateTimingFootnote';

export default function onResize() {
    //add maximum point interactivity, custom title and formatting
    customizePoints.call(this);

    //draw the quadrants and add drag interactivity
    updateSummaryTable.call(this);
    drawQuadrants.call(this);
    addLineDrag.call(this);

    // hide the legend if no group options are given
    toggleLegend.call(this);

    // add boxplots
    initBoxPlots.call(this);

    //axis formatting
    adjustTicks.call(this);
    addAxisLabelTitles.call(this);

    //add timing footnote
    updateTimingFootnote.call(this);
}
