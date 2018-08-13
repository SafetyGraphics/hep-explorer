import updateAxisSettings from './onPreprocess/updateAxisSettings';
import updateCutpointControlLabels from './onPreprocess/updateCutpointControlLabels';
import updateRRatioSpan from './onPreprocess/updateRRatioSpan';
import { flattenData } from './onPreprocess/flattenData';
import addVisitLevelData from './onPreprocess/addVisitLevelData';
import { cleanData } from './onPreprocess/cleanData';
import { setLegendLabel } from './onPreprocess/setLegendLabel';
import { dropMissingValues } from './onPreprocess/dropMissingValues';

export default function onPreprocess() {
    updateAxisSettings.call(this); // update axis label based on display type
    updateCutpointControlLabels.call(this); // update cutpoint control labels given x- and y-axis variables
    updateRRatioSpan.call(this);
    cleanData.call(this); // clean visit-level data - imputation and variable derivations
    this.raw_data = flattenData.call(this); // convert from visit-level data to participant-level data
    addVisitLevelData.call(this); // add visit-level data to plot
    setLegendLabel.call(this); // update legend label based on group variable
    dropMissingValues.call(this);
}
