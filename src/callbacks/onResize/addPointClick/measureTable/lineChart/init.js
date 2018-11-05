import { insertAfter } from './util/insertAfter';
import { defaultSettings as settings } from './defaultSettings';
import { createChart } from 'webcharts';

import { setDomain } from './onDraw/setDomain';
import { drawPopulationExtent } from './onResize/drawPopulationExtent';
import { drawNormalRange } from './onResize/drawNormalRange';
import { addPointTitles } from './onResize/addPointTitles';
import { updatePointFill } from './onResize/updatePointFill';

export function init(d, edish) {
    //layout the new cells on the DOM (slightly easier than using D3)
    var summaryRow_node = this.parentNode;
    var chartRow_node = document.createElement('tr');
    var chartCell_node = document.createElement('td');
    insertAfter(chartRow_node, summaryRow_node);
    chartRow_node.appendChild(chartCell_node);

    //update the row styles
    d3.select(chartRow_node)
        .style('background', 'none')
        .style('border-bottom', '0.5px solid black');

    //layout the svg with D3
    const cellCount = d3.select(summaryRow_node).selectAll('td')[0].length;
    var chartCell = d3.select(chartCell_node).attr('colspan', cellCount);

    //draw the chart
    settings.colors = [d.color];
    var lineChart = createChart(chartCell_node, settings);
    lineChart.on('draw', function() {
        setDomain.call(this);
    });
    lineChart.edish = edish;
    lineChart.on('resize', function() {
        drawPopulationExtent.call(this);
        drawNormalRange.call(this);
        addPointTitles.call(this);
        updatePointFill.call(this);
    });
    lineChart.init(d.spark_data);
    lineChart.row = chartRow_node;
    return lineChart;
}
