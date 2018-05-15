export function updateAxisSettings() {
    var chart = this;
    var config = this.config;

    //note: doing this in preprocess so that we can (theoretically have a control to change the variable on each axis later on)
    var xMeasure = config.measure_details.find(f => f.axis == 'x'),
        yMeasure = config.measure_details.find(f => f.axis == 'y');

    config.x.column = xMeasure.label;

    var unit =
        config.display == 'relative_uln'
            ? ' (xULN)'
            : config.display == 'relative_baseline'
                ? ' (xBaseline)'
                : config.display == 'absolute' ? ' (raw values)' : null;

    config.x.label = xMeasure.measure + unit;

    config.y.column = yMeasure.label;
    config.y.label = yMeasure.measure + unit;
}
