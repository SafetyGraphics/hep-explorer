import { initQuadrants } from './onLayout/initQuadrants';
import { initRugs } from './onLayout/initRugs';
import { initVisitPath } from './onLayout/initVisitPath';

export default function onLayout() {
    initQuadrants.call(this);
    initRugs.call(this);
    initVisitPath.call(this);
}
