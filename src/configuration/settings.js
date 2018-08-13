import rendererSettings from './settings/renderer';
import webchartsSettings from './settings/webcharts';

export default function settings() {
    return Object.assign({}, rendererSettings(), webchartsSettings());
}
