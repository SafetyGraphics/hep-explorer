import updateAxisSettings from './onPreprocess/updateAxisSettings';
import updateCutpointControlLabels from './onPreprocess/updateCutpointControlLabels';
import updateRRatioSpan from './onPreprocess/updateRRatioSpan';
import { flattenData } from './onPreprocess/flattenData';
import { setLegendLabel } from './onPreprocess/setLegendLabel';
import { imputeData } from './onPreprocess/imputeData';
import { dropMissingValues } from './onPreprocess/dropMissingValues';

export default function onPreprocess() {
    updateAxisSettings.call(this); //update axis label based on display type
    updateCutpointControlLabels.call(this); //update cutpoint control labels given x- and y-axis variables
    updateRRatioSpan.call(this);
    imputeData.call(this); //clean up values < llod
    this.raw_data = flattenData.call(this); //update flattened data
    setLegendLabel.call(this); //update legend label based on group variable
    dropMissingValues.call(this);
}
