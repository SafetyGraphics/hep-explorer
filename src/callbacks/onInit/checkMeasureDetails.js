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

    //check that x_options, y_options and size_options all have value keys/values in measure_values
    const valid_options = d3.merge([Object.keys(config.measure_values), ['rRatio']]);
    const all_options = ['x_options', 'y_options', 'point_size_options'];
    all_options.forEach(function(options) {
        config[options].forEach(function(option) {
            if (valid_options.indexOf(option) == -1) {
                delete config[options][option];
                console.warn(
                    option +
                        " wasn't found in the measure_values index and has been removed from config." +
                        options +
                        '. This may cause problems with the chart.'
                );
            }
        });
    });

    //check that all measure_values have associated cut measure_values
    Object.keys(config.measure_values).forEach(function(m) {
        // does a cut point for the custom value exist? if not create it.
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
