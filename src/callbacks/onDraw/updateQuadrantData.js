export function updateQuadrantData() {
    var chart = this;
    var config = this.config;

    //update cut data
    var dimensions = ['x', 'y'];
    dimensions.forEach(function(dimension) {
        //change to the stored cut point if the display changed
        if (config.quadrants.cut_data.displayChange) {
            config.quadrants.cut_data[dimension] = config.measure_details.find(
                f => f.axis == dimension
            ).cut[config.display];
            chart.controls.wrap
                .selectAll('div.control-group')
                .filter(f => f.option == 'quadrants.cut_data.' + dimension)
                .select('input')
                .node().value =
                config.quadrants.cut_data[dimension];
        }

        // get value linked to the controls (quadrant_cut_obj), add propogate it elsewhere
        var current_cut = config.quadrants.cut_data[dimension];
        config.measure_details.find(f => f.axis == dimension).cut[config.display] = current_cut;
        config.quadrants.cut_data.filter(f => f.dimension == dimension)[0] = current_cut;
    });

    config.quadrants.cut_data.displayChange = false;

    //add "eDISH_quadrant" column to raw_data
    const x_var = this.config.x.column;
    const y_var = this.config.y.column;
    this.imputed_data.forEach(function(d) {
        var x_cat = d[x_var] >= config.quadrants.cut_data.x ? 'xHigh' : 'xNormal';
        var y_cat = d[y_var] >= config.quadrants.cut_data.y ? 'yHigh' : 'yNormal';
        d['eDISH_quadrant'] = x_cat + ':' + y_cat;
    });

    //update Quadrant data
    config.quadrants.quadrant_data.forEach(function(quad) {
        quad.count = chart.filtered_data.filter(d => d.eDISH_quadrant == quad.dataValue).length;
        quad.total = chart.filtered_data.length;
        quad.percent = d3.format('0.1%')(quad.count / quad.total);
    });
}
