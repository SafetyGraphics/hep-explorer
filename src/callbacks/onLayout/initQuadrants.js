import { init } from './quadrants/init';
import { layout } from './quadrants/layout';

export function initQuadrants() {
    init.call(this);
    layout.call(this);
}
