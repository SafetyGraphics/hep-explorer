//Map values from settings to control inputs
export default function syncControlInputs(controlInputs, settings) {
    ////////////////////////
    // Group control
    ///////////////////////

    const groupControl = controlInputs.find(controlInput => controlInput.label === 'Group');

    //sync start value
    groupControl.start = settings.color_by; //sync start value

    //sync values
    settings.group_cols
        .filter(group => group.value_col !== 'NONE')
        .forEach(group => {
            groupControl.values.push(group.value_col);
        });

    //drop the group control if NONE is the only option
    if (settings.group_cols.length == 1)
        controlInputs = controlInputs.filter(controlInput => controlInput.label != 'Group');

    //////////////////////////
    // x-axis measure control
    //////////////////////////

    // drop the control if there's only one option
    if (settings.x_options.length === 1)
        controlInputs = controlInputs.filter(controlInput => controlInput.option !== 'x.column');
    else {
        //otherwise sync the properties
        const xAxisMeasureControl = controlInputs.find(
            controlInput => controlInput.option === 'x.column'
        );

        xAxisMeasureControl.description = settings.x_options.join(', ');
        xAxisMeasureControl.start = settings.x_options[0];
        xAxisMeasureControl.values = settings.x_options;
    }

    //////////////////////////////////
    // x-axis reference line control
    //////////////////////////////////

    const xRefControl = controlInputs.find(
        controlInput => controlInput.description === 'X-axis Reference Line'
    );
    xRefControl.label = `${settings.x_options[0]} Cutpoint`;
    xRefControl.option = 'settings.cuts.' + [settings.x.column] + '.' + [settings.display];

    ////////////////////////////
    // y-axis measure control
    ////////////////////////////

    // drop the control if there's only one option
    if (settings.y_options.length === 1)
        controlInputs = controlInputs.filter(controlInput => controlInput.option !== 'y.column');
    else {
        //otherwise sync the properties
        const yAxisMeasureControl = controlInputs.find(
            controlInput => controlInput.option === 'y.column'
        );
        yAxisMeasureControl.description = settings.y_options.join(', ');
        yAxisMeasureControl.start = settings.y_options[0];
        yAxisMeasureControl.values = settings.y_options;
    }

    //////////////////////////////////
    // y-axis reference line control
    //////////////////////////////////

    const yRefControl = controlInputs.find(
        controlInput => controlInput.description === 'Y-axis Reference Line'
    );
    yRefControl.label = `${settings.y_options[0]} Cutpoint`;

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

    const pointSizeControl = controlInputs.find(ci => ci.label === 'Point Size');

    pointSizeControl.start = settings.point_size || 'Uniform';

    settings.point_size_options.forEach(function(d) {
        pointSizeControl.values.push(d);
    });

    //drop the pointSize control if NONE is the only option
    if (settings.point_size_options.length == 0)
        controlInputs = controlInputs.filter(controlInput => controlInput.label != 'Point Size');

    //////////////////////////////////
    // Display control
    //////////////////////////////////

    controlInputs.find(
        controlInput => controlInput.label === 'Display Type'
    ).values = settings.display_options.map(m => m.label);

    //////////////////////////////////
    // Add filters to inputs
    //////////////////////////////////
    if (settings.filters && settings.filters.length > 0) {
        let otherFilters = settings.filters.map(filter => {
            filter = {
                type: 'subsetter',
                value_col: filter.value_col ? filter.value_col : filter,
                label: filter.label ? filter.label : filter.value_col ? filter.value_col : filter
            };
            return filter;
        });
        return d3.merge([otherFilters, controlInputs]);
    } else return controlInputs;
}
