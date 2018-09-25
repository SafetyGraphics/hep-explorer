import { insertAfter } from './util/insertAfter';
import { defaultSettings as settings } from './defaultSettings';
import { createChart } from 'webcharts';

import { drawBoxPlot } from './onResize/drawBoxPlot';
import { drawLimits } from './onResize/drawLimits';
import { drawNormalRange } from './onResize/drawNormalRange';
import { drawOutliers } from './onResize/drawOutliers';

export function init(d) {
    //layout the new cells on the DOM (slightly easier than using D3)
    var summaryRow_node = this.parentNode;
    var chartRow_node = document.createElement('tr');
    var chartCell_node = document.createElement('td');
    insertAfter(chartRow_node, summaryRow_node);
    chartRow_node.appendChild(chartCell_node);

    //update the row styles
    d3.select(summaryRow_node).style('border-bottom', 'none');
    d3
        .select(chartRow_node)
        .style('background', 'none')
        .style('border-bottom', '0.5px solid black');

    //layout the svg with D3
    const cellCount = d3.select(summaryRow_node).selectAll('td')[0].length;
    var chartCell = d3.select(chartCell_node).attr('colspan', cellCount);

    //draw the chart
    var lineChart = createChart(chartCell_node, settings);
    lineChart.on('resize', function() {
        drawOutliers.call(this, d);
        drawBoxPlot.call(this, d);
        drawLimits.call(this, d);
        drawNormalRange.call(this, d);
    });
    lineChart.init(d.spark_data);
}
