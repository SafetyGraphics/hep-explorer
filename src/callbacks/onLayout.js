import { initQuadrants } from './onLayout/initQuadrants';
import { initRugs } from './onLayout/initRugs';

export default function onLayout() {
    initQuadrants.call(this);
    initRugs.call(this);
}
