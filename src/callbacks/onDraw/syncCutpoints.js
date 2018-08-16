export default function syncCutpoints() {
    var chart = this;
    var config = this.config;

    //update cut data
    var dimensions = ['x', 'y'];
    dimensions.forEach(function(dimension) {
        //change to the stored cut point if the display changed
        if (config.quadrants.cut_data.displayChange) {
            config.quadrants.cut_data[dimension] =
                config[dimension].measure_detail.cut[config.display];
            chart.controls.wrap
                .selectAll('div.control-group')
                .filter(f => f.option == 'quadrants.cut_data.' + dimension)
                .select('input')
                .node().value =
                config.quadrants.cut_data[dimension];
        }

        // get value linked to the controls (quadrant_cut_obj), add propogate it elsewhere
        var current_cut = config.quadrants.cut_data[dimension];
        config[dimension].measure_detail.cut[config.display] = current_cut;
        config.quadrants.cut_data.filter(f => f.dimension == dimension)[0] = current_cut;
    });

    config.quadrants.cut_data.displayChange = false;
}
