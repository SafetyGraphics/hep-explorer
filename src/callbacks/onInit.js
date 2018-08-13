import checkMeasureDetails from './onInit/checkMeasureDetails';
import checkRequiredVariables from './onInit/checkRequiredVariables';
import iterateOverData from './onInit/iterateOverData';
import addRRatioFilter from './onInit/addRRatioFilter';

export default function onInit() {
    checkMeasureDetails.call(this);
    iterateOverData.call(this);
    checkRequiredVariables.call(this);
    addRRatioFilter.call(this);
}
