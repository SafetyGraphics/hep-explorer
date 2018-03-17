import { flattenData } from './util/flattenData';

export default function onInit() {
    this.raw_data = flattenData.call(this);
}
