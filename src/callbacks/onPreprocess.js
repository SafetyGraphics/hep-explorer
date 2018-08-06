import updateRRatioSpan from './onPreprocess/updateRRatioSpan';
import { flattenData } from './onPreprocess/flattenData';
import { updateAxisSettings } from './onPreprocess/updateAxisSettings';
import { setLegendLabel } from './onPreprocess/setLegendLabel';
import { cleanData } from './onPreprocess/cleanData';
import { dropMissingValues } from './onPreprocess/dropMissingValues';

export default function onPreprocess() {
    updateRRatioSpan.call(this);
    cleanData.call(this); //clean visit-level data - imputation and variable derivations
    this.raw_data = flattenData.call(this); //convert from visit-level data to participant-level data
    setLegendLabel.call(this); //update legend label based on group variable
    updateAxisSettings.call(this); //update axis label based on display type
    dropMissingValues.call(this);
}
