export default function checkMeasureDetails() {
    var chart = this;
    var config = this.config;
    const measures = d3
        .set(this.raw_data.map(d => d[config.measure_col]))
        .values()
        .sort();
    const specifiedMeasures = Object.keys(config.measure_values).map(e => config.measure_values[e]);
    var missingMeasures = [];
    Object.keys(config.measure_values).forEach(function(d) {
        if (measures.indexOf(config.measure_values[d]) == -1) {
            missingMeasures.push(config.measure_values[d]);
            delete config.measure_values[d];
        }
    });
    const nMeasuresRemoved = missingMeasures.length;
    if (nMeasuresRemoved > 0)
        console.warn(
            `The data are missing ${
                nMeasuresRemoved === 1 ? 'this measure' : 'these measures'
            }: ${missingMeasures.join(', ')}.`
        );

    //automatically add Measures if requested
    if (config.add_measures) {
        measures.forEach(function(m, i) {
            if (specifiedMeasures.indexOf(m) == -1) {
                config.measure_values['m' + i] = m;
            }
        });
    }

    //check that x_options, y_options and size_options all have value keys/values in measure_values
    const valid_options = Object.keys(config.measure_values);
    const all_settings = ['x_options', 'y_options', 'point_size_options'];
    all_settings.forEach(function(setting) {
        // remove invalid options
        config[setting].forEach(function(option) {
            if (valid_options.indexOf(option) == -1) {
                delete config[options][option];
                console.warn(
                    option +
                        " wasn't found in the measure_values index and has been removed from config." +
                        setting +
                        '. This may cause problems with the chart.'
                );
            }
        });

        // update the control input settings
        const controlLabel =
            setting == 'x_options'
                ? 'X-axis Measure'
                : setting == 'y_options'
                ? 'Y-axis Measure'
                : 'Point Size';
        var input = chart.controls.config.inputs.find(ci => ci.label == controlLabel);

        if (input) {
            //only update this if the input settings exist - axis inputs with only one value are deleted
            // add options for controls requesting 'all' measures
            if (config[setting + '_all']) {
                const point_size_options = d3.merge([['Uniform', 'rRatio'], valid_options]);
                config[setting] =
                    setting == 'point_size_options' ? point_size_options : valid_options;
                input.values = config[setting];
            }
        }
    });
    //check that all measure_values have associated cuts
    Object.keys(config.measure_values).forEach(function(m) {
        // does a cut point for the measure exist? If not, create a placeholder.
        if (!config.cuts.hasOwnProperty(m)) {
            config.cuts[m] = {};
        }

        // does the cut have non-null baseline and ULN cuts associated, if not use the default values
        config.cuts[m].relative_baseline =
            config.cuts[m].relative_baseline || config.cuts.defaults.relative_baseline;
        config.cuts[m].relative_uln =
            config.cuts[m].relative_uln || config.cuts.defaults.relative_uln;
    });
}
