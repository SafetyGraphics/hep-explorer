import { flattenData } from './util/flattenData';

export default function onPreprocess() {
    //update flattened data
    this.raw_data = flattenData.call(this);
}
