import { drawQuadrants } from './onResize/drawQuadrants';
import { addPointMouseover } from './onResize/addPointMouseover';

export default function onResize() {
    drawQuadrants.call(this);
    addPointMouseover.call(this);
}
