import { updateQuadrantData } from './onDraw/updateQuadrantData';
import { setDomain } from './onDraw/setDomain';

export default function onDraw() {
    //get current cutpoints and classify participants in to eDISH quadrants
    updateQuadrantData.call(this);

    //update domains to include cut lines
    setDomain.call(this, 'x');
    setDomain.call(this, 'y');
}
