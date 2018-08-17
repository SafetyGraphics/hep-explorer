import { drawQuadrants } from './onResize/drawQuadrants';
import { updateSummaryTable } from './onLayout/quadrants/updateSummaryTable';
import { addPointMouseover } from './onResize/addPointMouseover';
import { addPointClick } from './onResize/addPointClick';
import { addPointTitles } from './onResize/addPointTitles';
import { addAxisLabelTitles } from './onResize/addAxisLabelTitles';
import { toggleLegend } from './onResize/toggleLegend';
import { init as addLineDrag } from './onResize/addLineDrag/init';
import { init as initBoxPlots } from './onResize/addBoxPlots/init';
import { formatPoints } from './onResize/formatPoints';
import { setPointSize } from './onResize/setPointSize';
import { setPointOpacity } from './onResize/setPointOpacity';
import { adjustTicks } from './onResize/adjustTicks';
import { updateParticipantMarks } from './onResize/updateParticipantMarks';

export default function onResize() {
    //add point interactivity, custom title and formatting
    addPointMouseover.call(this);
    addPointClick.call(this);
    addPointTitles.call(this);
    addAxisLabelTitles.call(this);
    formatPoints.call(this);
    setPointSize.call(this);
    setPointOpacity.call(this);
    updateParticipantMarks.call(this);

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
}
