import { updateQuadrantData } from './onDraw/updateQuadrantData';
import { setDomain } from './onDraw/setDomain';
import { clearParticipantDetails } from './onResize/clearParticipantDetails';

export default function onDraw() {
    //clear participant Details
    if (this.config.quadrants.table.wrap.style('display') === 'none')
        clearParticipantDetails.call(this);

    //get current cutpoints and classify participants in to eDISH quadrants
    updateQuadrantData.call(this);

    //update domains to include cut lines
    setDomain.call(this, 'x');
    setDomain.call(this, 'y');
}
