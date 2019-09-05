import './util/polyfills';
import './util/moveTo.js';
import clone from './util/clone.js';
import configuration from './configuration/index';
import { createChart, createControls } from 'webcharts';
import callbacks from './callbacks/index';
import init from './init';
import destroy from './destroy';

export default function hepexplorer(element, settings) {
    const initial_settings = clone(settings);
    const defaultSettings = configuration.settings();
    const controlInputs = configuration.controlInputs();
    const mergedSettings = Object.assign({}, defaultSettings, settings);
    const syncedSettings = configuration.syncSettings(mergedSettings);
    const syncedControlInputs = configuration.syncControlInputs(controlInputs, syncedSettings);
    const controls = createControls(element, { location: 'top', inputs: syncedControlInputs });
    const chart = createChart(element, syncedSettings, controls);

    chart.element = element;
    chart.initial_settings = initial_settings;

    //Define callbacks.
    for (const callback in callbacks)
        chart.on(callback.substring(2).toLowerCase(), callbacks[callback]);

    const hepexplorer = {
        element,
        settings,
        chart,
        init,
        destroy
    };

    return hepexplorer;
}
