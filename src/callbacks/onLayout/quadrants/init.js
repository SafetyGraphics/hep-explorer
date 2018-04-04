import defaultCutData from './defaultCutData';
import defaultQuadrantData from './defaultQuadrantData';

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
    quadrants.cut_data.z = null;

    ///////////////////////////////////////////////////////////
    // set initial values
    //////////////////////////////////////////////////////////
    quadrants.cut_data.x = config.measure_details.find(f => f.axis == 'x').cut[config.display];

    chart.controls.wrap
        .selectAll('div.control-group')
        .filter(f => f.option == 'quadrants.cut_data.x')
        .select('input')
        .node().value =
        quadrants.cut_data.x;

    quadrants.cut_data.y = config.measure_details.find(f => f.axis == 'y').cut[config.display];

    chart.controls.wrap
        .selectAll('div.control-group')
        .filter(f => f.option == 'quadrants.cut_data.y')
        .select('input')
        .node().value =
        quadrants.cut_data.y;

    quadrants.cut_data.z = config.measure_details.find(f => f.axis == 'z').cut[config.display];

    chart.controls.wrap
        .selectAll('div.control-group')
        .filter(f => f.option == 'quadrants.cut_data.z')
        .select('input')
        .node().value =
        quadrants.cut_data.z;
}
