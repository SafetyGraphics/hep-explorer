export default function setCutpointMinimums() {
    const chart = this;
    const config = this.config;
    const lower_limits = {
        x: chart['x_dom'][0],
        y: chart['y_dom'][0]
    };

    //Make sure cutpoint isn't below lower domain - Comes in to play when changing from log to linear axes
    Object.keys(lower_limits).forEach(function(dimension) {
        var current_cut = config.quadrants.cut_data[dimension];
        var min = lower_limits[dimension];
        if (current_cut < min) {
            config.quadrants.cut_data[dimension] = min;
            config[dimension].measure_detail.cut[config.display] = min;
            config.quadrants.cut_data.filter(f => f.dimension == dimension)[0] = min;
            chart.controls.wrap
                .selectAll('div.control-group')
                .filter(f => f.option == 'quadrants.cut_data.' + dimension)
                .select('input')
                .node().value =
                config.quadrants.cut_data[dimension];
        }
    });

    //Update cut point controls
    this.controls.wrap
        .selectAll('.control-group')
        .filter(d => /.-axis cut/i.test(d.description))
        .attr('min', d => lower_limits[d.description.split('-')[0]])
        .on('change', function(d) {
            const dimension = d.description.split('-')[0].toLowerCase();
            const min = lower_limits[dimension];
            const input = d3.select(this).select('input');

            //Prevent a cutpoint less than the lower domain.
            if (input.property('value') < min) input.property('value', min);

            //Update chart setting.
            chart.config.quadrants.cut_data[dimension] = input.property('value');

            //Redraw.
            chart.draw();
        });
}
