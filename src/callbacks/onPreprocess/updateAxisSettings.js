export default function updateAxisSettings() {
    const config = this.config;

    //note: doing this in preprocess so that we can (theoretically have a control to change the variable on each axis later on)
    const unit =
        config.display == 'relative_uln'
            ? ' (xULN)'
            : config.display == 'relative_baseline'
                ? ' (xBaseline)'
                : config.display == 'absolute' ? ' (raw values)' : null;

    //Update x-axis settings.
    config.x.measure_detail = config.measure_details.find(
        measure_detail => measure_detail.label === config.x.column
    );
    config.x.label = config.x.measure_detail.measure + unit;

    //Update y-axis settings.
    config.y.measure_detail = config.measure_details.find(
        measure_detail => measure_detail.label === config.y.column
    );
    config.y.label = config.y.measure_detail.measure + unit;
}
