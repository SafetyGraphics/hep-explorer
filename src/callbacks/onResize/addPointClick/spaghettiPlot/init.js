import { defaultSettings as spaghettiSettings } from './defaultSettings';
import { createChart, createControls } from 'webcharts';
import onResize from './onResize';

export function init(d) {
    var chart = this;
    var config = this.config;

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

    chart.spaghetti = createChart(
        this.element + ' .participantDetails .spaghettiPlot',
        spaghettiSettings
    );
    chart.spaghetti.on('resize', onResize);
    chart.spaghetti.init(matches);
}
