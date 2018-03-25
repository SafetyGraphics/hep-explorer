import { updateQuadrantData } from './onDraw/updateQuadrantData';
import { setDomain } from './onDraw/setDomain';
import { clearVisitPath } from './onResize/addPointClick/clearVisitPath';
import { hideMeasureTable } from './onResize/addPointClick/hideMeasureTable';
import { clearRugs } from './onResize/addPointMouseover/clearRugs';

export default function onDraw() {
    //clear highlights
    clearVisitPath.call(this);
    clearRugs.call(this, 'x');
    clearRugs.call(this, 'y');
    hideMeasureTable.call(this);

    //get current cutpoints and classify participants in to eDISH quadrants
    updateQuadrantData.call(this);

    //update domains to include cut lines
    setDomain.call(this, 'x');
    setDomain.call(this, 'y');
}
