import { defaultSettings as spaghettiSettings } from './defaultSettings';
import { createChart, createControls } from 'webcharts';

export function draw(d) {
    var chart = this;
    var config = this.config;

    console.log('spaghetti time!');
    var allMatches = d.values.raw[0].raw.filter(f => f.key_measure);

    //sync settings
    spaghettiSettings.x.column = config.visitn_col;
    spaghettiSettings.color_by = config.measure_col;
    spaghettiSettings.marks[0].per = [config.id_col, config.measure_col];
    spaghettiSettings.marks[1].per = [config.id_col, config.visitn_col, config.measure_col];

    //draw that chart
    chart.wrap.append('div').attr('class', 'spaghetti');
    chart.spaghetti = createChart('.spaghetti', spaghettiSettings);
    chart.spaghetti.init(allMatches);
}
