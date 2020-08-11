export default function updateAxisSettings() {
    const config = this.config;
    const unit =
        config.display == 'relative_uln'
            ? ' [xULN]'
            : config.display == 'relative_baseline'
            ? ' [xBaseline]'
            : config.display == 'absolute'
            ? ' [raw values]'
            : null;

    //Update axis labels.
    let xValue = config.measure_values[config.x.column]
        ? config.measure_values[config.x.column]
        : config.x.column;
    config.x.label = xValue + unit;
    let yValue = config.measure_values[config.y.column]
        ? config.measure_values[config.y.column]
        : config.y.column;
    config.y.label = yValue + unit;
}
