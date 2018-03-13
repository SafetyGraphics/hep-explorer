import { flattenData } from './onPreprocess/flattenData';

export default function onPreprocess() {
    console.log(this);
    this.raw_data = flattenData.call(this);
}
