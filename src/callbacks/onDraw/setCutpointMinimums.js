export default function setCutpointMinimums() {
    const chart = this;
    const config = this.config;
    const lower_limits = {
        x: chart['x_dom'][0],
        y: chart['y_dom'][0]
    };

    //Make sure cutpoint isn't below lower domain - Comes in to play when changing from log to linear axes
    Object.keys(lower_limits).forEach(function(dimension) {
        var measure = config[dimension].column;
        var current_cut = config.cuts[measure][config.display];
        var min = lower_limits[dimension];
        if (current_cut < min) {
            config.cuts[measure][config.display] = min;
            chart.controls.wrap
                .selectAll('div.control-group')
                .filter(
                    f =>
                        f.description
                            ? f.description.toLowerCase() == dimension + '-axis reference line'
                            : false
                )
                .select('input')
                .node().value = min;
        }
    });

    //Update cut point controls
    var controlWraps = this.controls.wrap
        .selectAll('.control-group')
        .filter(d => /.-axis Reference Line/i.test(d.description))
        .attr('min', d => lower_limits[d.description.split('-')[0]])
        /* not working since the chart.draw() fires immediately and then the callback below fires afterwards :( */
        /* probably don't want to initialize this as a webchart control - annoying */

        .on('change', function(d) {
            const dimension = d.description.split('-')[0].toLowerCase();
            const min = lower_limits[dimension];
            const input = d3.select(this).select('input');

            console.log('changed ' + dimension);
            console.log(min);
            console.log(input.property('value'));
            console.log(input.node().value);

            //Prevent a cutpoint less than the lower domain.
            if (input.property('value') < min) input.property('value', min);

            //Update chart setting.
            var measure = config[dimension].column;
            console.log(measure);
            config.cuts[measure][config.display] = input.property('value');
        });
}
