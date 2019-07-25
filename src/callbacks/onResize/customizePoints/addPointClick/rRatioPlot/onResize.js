import drawCutLines from './onResize/drawCutLines';
import updateClipPath from './onResize/updateClipPath';
import addPointTitles from './onResize/addPointTitles';

export default function onResize() {
    drawCutLines.call(this);
    updateClipPath.call(this);
    addPointTitles.call(this);
}
