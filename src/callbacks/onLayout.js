import { initQuadrants } from './onLayout/initQuadrants';
export default function onLayout() {
    console.log(this);
    initQuadrants.call(this);
}
