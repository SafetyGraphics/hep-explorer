import { defaultSettings as spaghettiSettings } from './defaultSettings';
import { controlInputs } from './controlInputs';
import { createChart, createControls } from 'webcharts';
import onResize from './onResize';
import onDraw from './onDraw';

export function init(d) {
    var chart = this; //the full eDish object
    var config = this.config; //the eDish config
    var matches = d.values.raw[0].raw.filter(f => f.key_measure);

    //flag variables above the cut-off
    matches.forEach(function(d) {
        const measure = d[config['measure_col']];
        const label = Object.keys(config.measure_values).find(
            key => config.measure_values[key] == measure
        );
        d.cut = config.cuts[label].relative_uln;

        d.flagged = d.relative_uln >= d.cut;
    });

    if ('spaghetti' in chart) {
        chart.spaghetti.destroy();
    }

    //sync settings
    spaghettiSettings.x.column = config.visitn_col;
    spaghettiSettings.y.domain = d3.extent(chart.imputed_data, f => f.relative_uln);

    spaghettiSettings.color_by = config.measure_col;
    spaghettiSettings.marks[0].per = [config.id_col, config.measure_col];
    spaghettiSettings.marks[1].per = [config.id_col, config.visitn_col, config.measure_col];

    //draw that chart
    var spaghettiElement = this.element + ' .participantDetails .spaghettiPlot .chart';
    var spaghettiControls = createControls(spaghettiElement, {
        location: 'top',
        inputs: controlInputs
    });
    chart.spaghetti = createChart(spaghettiElement, spaghettiSettings, spaghettiControls);

    chart.spaghetti.parent = chart; //link the full eDish object
    chart.spaghetti.on('draw', onDraw);
    chart.spaghetti.on('resize', onResize);
    chart.spaghetti.init(matches);
}
