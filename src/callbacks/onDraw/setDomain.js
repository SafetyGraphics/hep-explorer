export function setDomain(dimension) {
    var config = this.config;
    var domain = this[dimension].domain();
    var measure = config[dimension].column;
    var measure_long = config.measure_values[measure];
    var cut = config.cuts[measure][config.display];
    var values = this.imputed_data
        .filter(f => f[config.measure_col] == measure_long)
        .map(m => +m[config.display])
        .filter(m => m > 0)
        .sort((a, b) => a - b);
    var val_extent = d3.extent(values);

    //make sure the domain contains the cut point and the max possible value for the measure
    domain[1] = d3.max([domain[1], cut * 1.01, val_extent[1]]);

    // make sure the domain lower limit captures all of the raw Values
    if (this.config[dimension].type == 'linear') {
        // just use the lower limit of 0 for continuous
        domain[0] = 0;
    } else if (this.config[dimension].type == 'log') {
        // use the smallest raw value for a log axis

        var minValue = val_extent[0];

        if (minValue < domain[0]) {
            domain[0] = minValue;
        }

        //throw a warning if the domain is > 0 if using log scale
        if (this[dimension].type == 'log' && domain[0] <= 0) {
            console.warn("Can't draw a log " + dimension + '-axis because there are values <= 0.');
        }
    }
    this[dimension + '_dom'] = domain;
}
