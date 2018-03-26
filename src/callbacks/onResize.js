import { drawQuadrants } from './onResize/drawQuadrants';
import { addPointMouseover } from './onResize/addPointMouseover';
import { addPointClick } from './onResize/addPointClick';
import { addTitle } from './onResize/addTitle';

export default function onResize() {
    drawQuadrants.call(this);
    addPointMouseover.call(this);
    addPointClick.call(this);
    addTitle.call(this);
}
