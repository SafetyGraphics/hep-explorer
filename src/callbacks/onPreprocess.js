import { flattenData } from './onPreprocess/flattenData';
import { updateAxisSettings } from './onPreprocess/updateAxisSettings';
import { setLegendLabel } from './onPreprocess/setLegendLabel';

export default function onPreprocess() {
    this.raw_data = flattenData.call(this); //update flattened data
    setLegendLabel.call(this); //update legend label based on group variable
    updateAxisSettings.call(this); //update axis label based on display type
}
