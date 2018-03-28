import { updateQuadrantData } from './onDraw/updateQuadrantData';
import { flagBaselineValues } from './onDraw/flagBaselineValues';
import { setDomain } from './onDraw/setDomain';
import { clearParticipantDetails } from './onResize/clearParticipantDetails';

export default function onDraw() {
    //clear participant Details
    clearParticipantDetails.call(this);

    //get current cutpoints and classify participants in to eDISH quadrants
    updateQuadrantData.call(this);

    //flag participant baseline values
    flagBaselineValues.call(this);

    //update domains to include cut lines
    setDomain.call(this, 'x');
    setDomain.call(this, 'y');
}
