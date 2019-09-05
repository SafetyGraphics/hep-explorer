import checkMeasureDetails from './onInit/checkMeasureDetails';
import iterateOverData from './onInit/iterateOverData';
import addRRatioFilter from './onInit/addRRatioFilter';
import { cleanData } from './onInit/cleanData';
import { initCustomEvents } from './onInit/initCustomEvents';

export default function onInit() {
    checkMeasureDetails.call(this);
    iterateOverData.call(this);
    addRRatioFilter.call(this);
    cleanData.call(this); //clean visit-level data - imputation and variable derivations
    initCustomEvents.call(this);
}
