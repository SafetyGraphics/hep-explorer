import { updateQuadrantData } from './onDraw/updateQuadrantData';
import { setDomain } from './onDraw/setDomain';
import { clearParticipantDetails } from './onResize/customizePoints/clearParticipantDetails';
import { updateFilterLabel } from './onDraw/updateFilterLabel';
import setCutpointMinimums from './onDraw/setCutpointMinimums';
import syncCutpoints from './onDraw/syncCutpoints';
import hideEmptyChart from './onDraw/hideEmptyChart';
import updateStudyDayControl from './onDraw/updateStudyDayControl';

export default function onDraw() {
    var chart = this;
    const dropped = chart.raw_data.filter(f => chart.filtered_data.indexOf(f) == -1);

    //show/hide the study day controls
    updateStudyDayControl.call(this);

    //clear participant Details (if they exist)
    clearParticipantDetails.call(this);

    //get correct cutpoint for the current view
    syncCutpoints.call(this);

    //update domains to include cut lines
    setDomain.call(this, 'x');
    setDomain.call(this, 'y');

    //Set update cutpoint interactivity
    setCutpointMinimums.call(this);

    //Classify participants in to eDISH quadrants
    updateQuadrantData.call(this);

    //update the count in the filter label
    updateFilterLabel.call(this);
    hideEmptyChart.call(this);
}
