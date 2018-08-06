import './util/object-assign';
import './polyfills/array-find.js';
import './polyfills/moveTo.js';
import clone from './util/clone.js';

import configuration from './configuration/index';

import { createChart, createControls } from 'webcharts';
import onInit from './callbacks/onInit';
import onLayout from './callbacks/onLayout';
import onPreprocess from './callbacks/onPreprocess';
import onDataTransform from './callbacks/onDataTransform';
import onDraw from './callbacks/onDraw';
import onResize from './callbacks/onResize';

export default function safetyedish(element, settings) {
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
    chart.on('init', onInit);
    chart.on('layout', onLayout);
    chart.on('preprocess', onPreprocess);
    chart.on('datatransform', onDataTransform);
    chart.on('draw', onDraw);
    chart.on('resize', onResize);

    return chart;
}
