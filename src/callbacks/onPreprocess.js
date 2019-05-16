import updateAxisSettings from './onPreprocess/updateAxisSettings';
import updateCutpointControlLabels from './onPreprocess/updateCutpointControlLabels';
import setMaxRRatio from './onPreprocess/setMaxRRatio';
import { flattenData } from './onPreprocess/flattenData';
import { setLegendLabel } from './onPreprocess/setLegendLabel';
import { dropMissingValues } from './onPreprocess/dropMissingValues';

export default function onPreprocess() {
    updateAxisSettings.call(this); //update axis label based on display type
    updateCutpointControlLabels.call(this); //update cutpoint control labels given x- and y-axis variables
    this.raw_data = flattenData.call(this); //convert from visit-level data to participant-level data
    setMaxRRatio.call(this);
    setLegendLabel.call(this); //update legend label based on group variable
    dropMissingValues.call(this);
}
