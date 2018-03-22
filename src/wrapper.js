import './util/object-assign';
import './polyfills/array-find.js';

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

    /*
        listingSettings = {
            cols: syncedSettings.details.map(detail => detail.value_col),
            headers: syncedSettings.details.map(detail => detail.label),
            searchable: syncedSettings.searchable,
            sortable: syncedSettings.sortable,
            pagination: syncedSettings.pagination,
            exportable: syncedSettings.exportable
        };

    chart.listing = createTable(element, listingSettings);
    chart.listing.init([]);
    chart.listing.wrap.selectAll('*').style('display', 'none');
    */

    //Define callbacks.
    chart.on('init', onInit);
    chart.on('layout', onLayout);
    chart.on('preprocess', onPreprocess);
    chart.on('datatransform', onDataTransform);
    chart.on('draw', onDraw);
    chart.on('resize', onResize);

    return chart;
}
