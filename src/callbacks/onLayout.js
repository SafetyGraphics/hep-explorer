import { initQuadrants } from './onLayout/initQuadrants';
import { initRugs } from './onLayout/initRugs';
import { initVisitPath } from './onLayout/initVisitPath';
import { initMeasureTable } from './onLayout/initMeasureTable';

export default function onLayout() {
    initQuadrants.call(this);
    initRugs.call(this);
    initVisitPath.call(this);
    initMeasureTable.call(this);
}
