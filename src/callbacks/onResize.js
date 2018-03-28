import { drawQuadrants } from './onResize/drawQuadrants';
import { addPointMouseover } from './onResize/addPointMouseover';
import { addPointClick } from './onResize/addPointClick';
import { addTitle } from './onResize/addTitle';
import { toggleLegend } from './onResize/toggleLegend';
import { fillFlaggedCircles } from './onResize/fillFlaggedCircles';

export default function onResize() {
    drawQuadrants.call(this);
    addPointMouseover.call(this);
    addPointClick.call(this);
    toggleLegend.call(this);
    addTitle.call(this);
    fillFlaggedCircles.call(this);
}
