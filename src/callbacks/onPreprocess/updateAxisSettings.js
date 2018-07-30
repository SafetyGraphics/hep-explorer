export function updateAxisSettings() {
    var chart = this;
    var config = this.config;

    //note: doing this in preprocess so that we can (theoretically have a control to change the variable on each axis later on)
    config.x.column = this.controls.wrap
        .selectAll('.control-group')
        .filter(d => d.option === 'x.column')
        .select('option:selected')
        .text();
    console.log(config.x.column);
    config.x.measure_detail = config.measure_details.find(measure_detail => measure_detail.label === config.x.column);
    var xMeasure = config.x.measure_detail;
    config.y.measure_detail = config.measure_details.find(measure_detail => measure_detail.axis === 'y');
    var yMeasure = config.y.measure_detail;

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
