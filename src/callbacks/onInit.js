import { flattenData } from './onPreprocess/flattenData';

export default function onInit() {
    this.raw_data = flattenData.call(this);
}
