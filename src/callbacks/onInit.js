import checkMeasureDetails from './onInit/checkMeasureDetails';
import iterateOverData from './onInit/iterateOverData';
import addRRatioFilter from './onInit/addRRatioFilter';

export default function onInit() {
    checkMeasureDetails.call(this);
    iterateOverData.call(this);
    addRRatioFilter.call(this);
}
