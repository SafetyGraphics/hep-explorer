import onResize from './onResize';
import onDraw from './onDraw';
import { defaultSettings as rrSettings } from './settings/defaultSettings';
import { createChart, createControls } from 'webcharts';

export function init(d) {
    var chart = this; //the full eDish object
    var config = this.config; //the eDish config
    var matches = d.values.raw[0].rRatio_raw;

    if ('rRatioChart' in chart) {
        chart.rRatioChart.destroy();
    }

    //sync settings
    rrSettings.marks[0].per = [config.id_col];
    rrSettings.marks[1].per = [config.id_col, config.studyday_col];

    //draw that chart
    var rrElement = this.element + ' .participantDetails .rrPlot .chart';
    chart.rRatioChart = createChart(rrElement, rrSettings);

    chart.rRatioChart.edish = chart; //link the full eDish object

    chart.rRatioChart.on('draw', onDraw);
    chart.rRatioChart.on('resize', onResize);

    chart.rRatioChart.init(matches);
}
