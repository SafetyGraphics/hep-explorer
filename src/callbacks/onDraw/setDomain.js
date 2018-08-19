export function setDomain(dimension) {
    var config = this.config;
    var domain = this[dimension].domain();
    var measure = config[dimension].column;
    var cut = config.cuts[measure][config.display];

    //make sure the domain contains the cut point
    if (cut * 1.01 >= domain[1]) {
        domain[1] = cut * 1.01;
    }

    // make sure the domain lower limit captures all of the raw Values
    if (this.config[dimension].type == 'linear') {
        // just use the lower limit of 0 for continuous
        domain[0] = 0;
    } else if (this.config[dimension].type == 'log') {
        // use the smallest raw value for a log axis
        var measure = config.measure_values[config[dimension].column];
        var values = this.imputed_data
            .filter(f => f[config.measure_col] == measure)
            .map(m => +m[config.display])
            .filter(m => m > 0)
            .sort((a, b) => a - b);
        var minValue = d3.min(values);

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
