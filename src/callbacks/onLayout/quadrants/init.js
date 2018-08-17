import { initSummaryTable } from './initSummaryTable';

export function init() {
    var chart = this;
    var config = chart.config;
    var quadrants = this.config.quadrants;

    const x_input = chart.controls.wrap
        .selectAll('div.control-group')
        .filter(f => f.description == 'X-axis Reference Line')
        .select('input');

    const y_input = chart.controls.wrap
        .selectAll('div.control-group')
        .filter(f => f.description == 'Y-axis Reference Line')
        .select('input');

    ///////////////////////////////////////////////////////////
    // set initial values
    //////////////////////////////////////////////////////////
    x_input.node().value = config.cuts[config.x.column][config.display];
    y_input.node().value = config.cuts[config.y.column][config.display];

    ///////////////////////////////////////////////////////////
    // set control step to 0.1
    //////////////////////////////////////////////////////////
    x_input.attr('step', 0.1);
    y_input.attr('step', 0.1);

    ///////////////////////////////////////////////////////////
    // initialize the summary table
    //////////////////////////////////////////////////////////
    initSummaryTable.call(chart);
}
