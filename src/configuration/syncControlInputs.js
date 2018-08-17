//Map values from settings to control inputs
export default function syncControlInputs(controlInputs, settings) {
    ////////////////////////
    // Group control
    ///////////////////////

    const groupControl = controlInputs.find(controlInput => controlInput.label === 'Group');

    //sync start value
    groupControl.start = settings.color_by; //sync start value

    //sync values
    settings.group_cols.filter(group => group.value_col !== 'NONE').forEach(group => {
        groupControl.values.push(group.value_col);
    });

    //drop the group control if NONE is the only option
    if (settings.group_cols.length == 1)
        controlInputs = controlInputs.filter(controlInput => controlInput.label != 'Group');

    //////////////////////////
    // x-axis measure control
    //////////////////////////

    const xAxisMeasures = settings.measure_details.filter(
        measure_detail => measure_detail.axis === 'x'
    );

    // drop the control if there's only one option
    if (xAxisMeasures.length === 1)
        controlInputs = controlInputs.filter(controlInput => controlInput.option !== 'x.column');
    else {
        //otherwise sync the properties
        const xAxisMeasureControl = controlInputs.find(
            controlInput => controlInput.option === 'x.column'
        );

        xAxisMeasureControl.description = xAxisMeasures
            .map(xAxisMeasure => xAxisMeasure.label)
            .join(', ');
        xAxisMeasureControl.start = xAxisMeasures[0].label;
        xAxisMeasureControl.values = xAxisMeasures.map(xAxisMeasure => xAxisMeasure.label);
    }

    //////////////////////////////////
    // x-axis reference line control
    //////////////////////////////////

    const xRefControl = controlInputs.find(
        controlInput => controlInput.description === 'X-axis Reference Line'
    );
    xRefControl.label = `${xAxisMeasures[0].label} Cutpoint`;

    xRefControl.option = 'settings.cuts.' + [settings.x.column] + '.' + [settings.display];

    ////////////////////////////
    // y-axis measure control
    ////////////////////////////

    const yAxisMeasures = settings.measure_details.filter(
        measure_detail => measure_detail.axis === 'y'
    );

    // drop the control if there's only one option
    if (yAxisMeasures.length === 1)
        controlInputs = controlInputs.filter(controlInput => controlInput.option !== 'y.column');
    else {
        //otherwise sync the properties
        const yAxisMeasureControl = controlInputs.find(
            controlInput => controlInput.option === 'y.column'
        );
        yAxisMeasureControl.description = yAxisMeasures
            .map(yAxisMeasure => yAxisMeasure.label)
            .join(', ');
        yAxisMeasureControl.start = yAxisMeasures[0].label;
        yAxisMeasureControl.values = yAxisMeasures.map(yAxisMeasure => yAxisMeasure.label);
    }

    //////////////////////////////////
    // y-axis reference line control
    //////////////////////////////////

    const yRefControl = controlInputs.find(
        controlInput => controlInput.description === 'Y-axis Reference Line'
    );
    yRefControl.label = `${yAxisMeasures[0].label} Cutpoint`;

    yRefControl.option = 'settings.cuts.' + [settings.y.column] + '.' + [settings.display];

    //////////////////////////////////
    // R ratio filter control
    //////////////////////////////////

    //drop the R Ratio control if r_ratio_filter is false
    if (!settings.r_ratio_filter) {
        controlInputs = controlInputs.filter(
            controlInput => controlInput.label != 'Minimum R Ratio'
        );
    }

    //////////////////////////////////
    // Point size control
    //////////////////////////////////

    const pointSizeControl = controlInputs.find(
        controlInput => controlInput.label === 'Point Size'
    );

    settings.measure_details.filter(f => f.axis != 'x' && f.axis != 'y').forEach(group => {
        pointSizeControl.values.push(group.label);
    });

    //drop the pointSize control if NONE is the only option
    if (settings.measure_details.length == 2)
        controlInputs = controlInputs.filter(controlInput => controlInput.label != 'Point Size');

    //////////////////////////////////
    // Display control
    //////////////////////////////////

    controlInputs.find(
        controlInput => controlInput.label === 'Display Type'
    ).values = settings.axis_options.map(m => m.label);

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
