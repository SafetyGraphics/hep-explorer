import { drawQuadrants } from './onResize/drawQuadrants';

export default function onResize() {
    drawQuadrants.call(this);
}
