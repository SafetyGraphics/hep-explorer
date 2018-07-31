//Map values from settings to control inputs
export default function syncControlInputs(controlInputs, settings) {
    //Sync group control.
    const groupControl = controlInputs.find(controlInput => controlInput.label === 'Group');
    groupControl.start = settings.color_by;
    settings.group_cols.filter(group => group.value_col !== 'NONE').forEach(group => {
        groupControl.values.push(group.value_col);
    });

    //drop the group control if NONE is the only option
    if (settings.group_cols.length == 1)
        controlInputs = controlInputs.filter(controlInput => controlInput.label != 'Group');

    //Sync x-axis measure control.
    const xAxisMeasures = settings.measure_details
        .filter(measure_detail => measure_detail.axis === 'x');

    if (xAxisMeasures.length === 1)
        controlInputs = controlInputs
            .filter(controlInput => controlInput.option !== 'x.column');
    else {
        const xAxisMeasureControl = controlInputs
            .find(controlInput => controlInput.option === 'x.column');
        xAxisMeasureControl.description = xAxisMeasures
            .map(xAxisMeasure => xAxisMeasure.label)
            .join(', ');
        xAxisMeasureControl.start = xAxisMeasures[0].label;
        xAxisMeasureControl.values = xAxisMeasures
            .map(xAxisMeasure => xAxisMeasure.label);
    }

    //Sync x-axis cut control.
    controlInputs
        .find(controlInput => controlInput.option === 'quadrants.cut_data.x')
        .label = `${xAxisMeasures[0].label} Cutpoint`;

    //Sync y-axis measure control.
    const yAxisMeasures = settings.measure_details
        .filter(measure_detail => measure_detail.axis === 'y');

    if (yAxisMeasures.length === 1)
        controlInputs = controlInputs
            .filter(controlInput => controlInput.option !== 'y.column');
    else {
        const yAxisMeasureControl = controlInputs
            .find(controlInput => controlInput.option === 'y.column');
        yAxisMeasureControl.description = yAxisMeasures
            .map(yAxisMeasure => yAxisMeasure.label)
            .join(', ');
        yAxisMeasureControl.start = yAxisMeasures[0].label;
        yAxisMeasureControl.values = yAxisMeasures
            .map(yAxisMeasure => yAxisMeasure.label);
    }

    //Sync y-axis cut control.
    controlInputs
        .find(controlInput => controlInput.option === 'quadrants.cut_data.y')
        .label = `${yAxisMeasures[0].label} Cutpoint`;

    //Sync point size control.
    const pointSizeControl = controlInputs.find(
        controlInput => controlInput.label === 'Point Size'
    );
    settings.measure_details.filter(f => (f.axis != 'x') && (f.axis != 'y')).forEach(group => {
        pointSizeControl.values.push(group.label);
    });

    //drop the pointSize control if NONE is the only option
    if (settings.measure_details.length == 2)
        controlInputs = controlInputs.filter(controlInput => controlInput.label != 'Point Size');

    //Sync display control
    controlInputs
        .find(controlInput => controlInput.label === 'Display Type')
        .values = settings.axis_options.map(m => m.label);

    //Add custom filters to control inputs.
    if (settings.filters && settings.filters.length > 0) {
        let otherFilters = settings.filters.map(filter => {
            filter = {
                type: 'subsetter',
                value_col: filter.value_col ? filter.value_col : filter,
                label: filter.label ? filter.label : filter.value_col ? filter.value_col : filter
            };
            return filter;
        });
        return controlInputs.concat(otherFilters);
    } else return controlInputs;
}
