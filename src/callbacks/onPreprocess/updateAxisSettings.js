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
    config.x.label = config.measure_values[config.x.column] + unit;
    config.y.label = config.measure_values[config.y.column] + unit;
}
