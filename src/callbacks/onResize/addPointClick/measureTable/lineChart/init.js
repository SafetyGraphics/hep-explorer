import { insertAfter } from './util/insertAfter';
import { defaultSettings as settings } from './defaultSettings';
import { createChart } from 'webcharts';

export function init(d) {
    //layout the new cells on the DOM (slightly easier than using D3)
    var summaryRow_node = this.parentNode;
    var chartRow_node = document.createElement('tr');
    var chartCell_node = document.createElement('td');
    insertAfter(chartRow_node, summaryRow_node);
    chartRow_node.appendChild(chartCell_node);

    //layout the svg with D3
    const cellCount = d3.select(summaryRow_node).selectAll('td')[0].length;
    var chartCell = d3
        .select(chartCell_node)
        .attr('colspan', cellCount)
        .text('test');

    //update the defaultSettings
    const config = d.eDish.config;
    settings.x.column = config.visitn_col;
    settings.marks[0].per = [config.id_col, config.measure_col];
    settings.marks[1].per = [config.id_col, config.visitn_col, config.measure_col];

    //draw the chart
    var lineChart = createChart(chartCell_node, settings);
    console.log(d);
    lineChart.init(d.raw);
}
