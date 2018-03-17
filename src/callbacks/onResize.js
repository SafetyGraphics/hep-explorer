import { drawQuadrants } from './onResize/drawQuadrants';

export default function onResize() {
    console.log(this);
    drawQuadrants.call(this);
}
