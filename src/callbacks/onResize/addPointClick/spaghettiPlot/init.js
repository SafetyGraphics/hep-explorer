import { defaultSettings as spaghettiSettings } from './settings/defaultSettings';
import { controlInputs } from './settings/controlInputs';
import { createChart, createControls } from 'webcharts';
import onLayout from './onLayout';
import onPreprocess from './onPreprocess';
import onResize from './onResize';
import onDraw from './onDraw';

export function init(d) {
    var chart = this; //the full eDish object
    var config = this.config; //the eDish config
    var matches = d.values.raw[0].raw.filter(f => f.key_measure);

    if ('spaghetti' in chart) {
        chart.spaghetti.destroy();
    }

    //sync settings
    spaghettiSettings.x.column = config.studyday_col;
    spaghettiSettings.color_by = config.measure_col;
    spaghettiSettings.marks[0].per = [config.id_col, config.measure_col];
    spaghettiSettings.marks[1].per = [config.id_col, config.studyday_col, config.measure_col];
    spaghettiSettings.firstDraw = true; //only initailize the measure table on first draw

    //flag variables above the cut-off
    matches.forEach(function(d) {
        const measure = d[config['measure_col']];
        const label = Object.keys(config.measure_values).find(
            key => config.measure_values[key] == measure
        );

        d.relative_uln_cut = config.cuts[label].relative_uln;
        d.relative_baseline_cut = config.cuts[label].relative_baseline;

        d.relative_uln_flagged = d.relative_uln >= d.relative_uln_cut;
        d.relative_baseline_flagged = d.relative_baseline >= d.relative_baseline_cut;
    });

    //update the controls
    var spaghettiElement = this.element + ' .participantDetails .spaghettiPlot .chart';

    //Add y axis type options
    controlInputs.find(f => f.label == 'Y-axis Display Type').values = config.display_options.map(
        m => m.label
    );

    //sync parameter filter
    controlInputs.find(f => f.label == 'Select Labs').value_col = config.measure_col;

    var spaghettiControls = createControls(spaghettiElement, {
        location: 'top',
        inputs: controlInputs
    });

    //draw that chart
    chart.spaghetti = createChart(spaghettiElement, spaghettiSettings, spaghettiControls);

    chart.spaghetti.edish = chart; //link the full eDish object
    chart.spaghetti.participant_data = d; //include the passed data (used to initialize the measure table)
    chart.spaghetti.on('layout', onLayout);
    chart.spaghetti.on('preprocess', onPreprocess);
    chart.spaghetti.on('draw', onDraw);
    chart.spaghetti.on('resize', onResize);
    chart.spaghetti.init(matches);

    //add a footnote
    chart.spaghetti.wrap
        .append('div')
        .attr('class', 'footnote')
        .style('font-size', '0.7em')
        .style('padding-top', '0.1em')
        .text(
            'Points are filled for values above the current reference value. Mouseover a line to see the reference line for that lab.'
        );
}
