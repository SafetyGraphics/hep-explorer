export function updateAxisSettings() {
    var chart = this;
    var config = this.config;

    //note: doing this in preprocess so that we can (theoretically have a control to change the variable on each axis later on)
    var xMeasure = config.measure_details.find(f => f.axis == 'x'),
        yMeasure = config.measure_details.find(f => f.axis == 'y');
    console.log(xMeasure);
    config.x.column = xMeasure.label;
    config.x.label =
        xMeasure.measure + (config.display == 'relative' ? ' (xULN)' : ' (raw values)');

    config.y.column = yMeasure.label;
    config.y.label =
        yMeasure.measure + (config.display == 'relative' ? ' (xULN)' : ' (raw values)');
}
