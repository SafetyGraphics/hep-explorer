import './util/object-assign';
import './polyfills/array-find.js';
import './polyfills/moveTo.js';

import defaultSettings from './defaultSettings';
import { syncSettings, syncControlInputs } from './defaultSettings';

import { createChart, createControls } from 'webcharts';

import onInit from './callbacks/onInit';
import onLayout from './callbacks/onLayout';
import onPreprocess from './callbacks/onPreprocess';
import onDataTransform from './callbacks/onDataTransform';
import onDraw from './callbacks/onDraw';
import onResize from './callbacks/onResize';

export default function safetyedish(element, settings) {
    const mergedSettings = Object.assign({}, defaultSettings, settings),
        syncedSettings = syncSettings(mergedSettings),
        syncedControlInputs = syncControlInputs(syncedSettings),
        controls = createControls(element, { location: 'top', inputs: syncedControlInputs }),
        chart = createChart(element, syncedSettings, controls);
    chart.element = element;

    //Define callbacks.
    chart.on('init', onInit);
    chart.on('layout', onLayout);
    chart.on('preprocess', onPreprocess);
    chart.on('datatransform', onDataTransform);
    chart.on('draw', onDraw);
    chart.on('resize', onResize);

    return chart;
}
