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

    chart.rRatioChart.on('resize', function() {
        //embiggen clip-path so points aren't clipped
        const radius = this.config.marks.find(mark => mark.type === 'circle').radius;
        this.svg
            .select('.plotting-area')
            .attr('width', this.plot_width + radius * 2 + 2) // plot width + circle radius * 2 + circle stroke width * 2
            .attr('height', this.plot_height + radius * 2 + 2) // plot height + circle radius * 2 + circle stroke width * 2
            .attr(
                'transform',
                `translate(-${
                    radius + 1 // translate left circle radius + circle stroke width
                },-${
                    radius + 1 // translate up circle radius + circle stroke width
                })`
            );
    });

    chart.rRatioChart.init(matches);
}
