import defaultCutData from './defaultCutData';
import defaultQuadrantData from './defaultQuadrantData';
import { initSummaryTable } from './initSummaryTable';

export function init() {
    var chart = this;
    var config = chart.config;
    this.config.quadrants = {};
    var quadrants = this.config.quadrants;

    //////////////////////////////////////////////////////////
    //create custom data objects for the lines and quadrants
    /////////////////////////////////////////////////////////
    quadrants.quadrant_data = defaultQuadrantData;

    quadrants.cut_data = defaultCutData;
    quadrants.cut_data.x = null; //Also store the cuts as properties for convenience
    quadrants.cut_data.y = null;

    ///////////////////////////////////////////////////////////
    // set initial values
    //////////////////////////////////////////////////////////
    quadrants.cut_data.x = config.x.measure_detail.cut[config.display];

    chart.controls.wrap
        .selectAll('div.control-group')
        .filter(f => f.option == 'quadrants.cut_data.x')
        .select('input')
        .node().value =
        quadrants.cut_data.x;

    quadrants.cut_data.y = config.y.measure_detail.cut[config.display];

    chart.controls.wrap
        .selectAll('div.control-group')
        .filter(f => f.option == 'quadrants.cut_data.y')
        .select('input')
        .node().value =
        quadrants.cut_data.y;

    ///////////////////////////////////////////////////////////
    // initialize the summary table
    //////////////////////////////////////////////////////////
    initSummaryTable.call(chart);
}
