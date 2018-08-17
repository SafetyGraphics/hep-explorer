import { init } from './quadrants/init';
import { layoutQuadrantLabels } from './quadrants/layoutQuadrantLabels';
import { layoutCutLines } from './quadrants/layoutCutLines';

export function initQuadrants() {
    init.call(this);
    layoutCutLines.call(this);
    layoutQuadrantLabels.call(this);
}
