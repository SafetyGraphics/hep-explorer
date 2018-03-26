import { flattenData } from './onPreprocess/flattenData';
import { updateAxisSettings } from './onPreprocess/updateAxisSettings';

export default function onPreprocess() {
    //update flattened data
    this.raw_data = flattenData.call(this);
    updateAxisSettings.call(this);
}
