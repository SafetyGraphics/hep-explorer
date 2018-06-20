import { flattenData } from './onPreprocess/flattenData';
import { updateAxisSettings } from './onPreprocess/updateAxisSettings';
import { setLegendLabel } from './onPreprocess/setLegendLabel';
import { imputeData } from './onPreprocess/imputeData';
import { dropMissingValues } from './onPreprocess/dropMissingValues';

export default function onPreprocess() {
    imputeData.call(this); //clean up values < llod
    this.raw_data = flattenData.call(this); //update flattened data
    setLegendLabel.call(this); //update legend label based on group variable
    updateAxisSettings.call(this); //update axis label based on display type
    dropMissingValues.call(this);
}
