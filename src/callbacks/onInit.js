import iterateOverData from './onInit/iterateOverData';
import addRRatioFilter from './onInit/addRRatioFilter';

export default function onInit() {
    iterateOverData.call(this);
    addRRatioFilter.call(this);
}
