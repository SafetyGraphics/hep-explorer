export default function syncCutpoints() {
    var chart = this;
    var config = this.config;

    //check to see if the cutpoint used is current
    if (
        config.cuts.x != config.x.column ||
        config.cuts.y != config.y.column ||
        config.cuts.display != config.display
    ) {
        // if not, update it!

        // track the current cut point variables
        config.cuts.x = config.x.column;
        config.cuts.y = config.y.column;
        config.cuts.display = config.display;

        // update the cutpoint shown in the control
        config.cuts.display_change = false; //reset the change flag;
        var dimensions = ['x', 'y'];
        dimensions.forEach(function(dimension) {
            //change the control to point at the correct cut point
            var dimInput = chart.controls.wrap
                .selectAll('div.control-group')
                .filter(f =>
                    f.description
                        ? f.description.toLowerCase() == dimension + '-axis reference line'
                        : false
                )
                .select('input');

            dimInput.node().value = config.cuts[config[dimension].column][config.display];

            //don't think this actually changes functionality, but nice to have it accurate just in case
            dimInput.option =
                'settings.cuts.' + [config[dimension].column] + '.' + [config.display];
        });
    }
}
