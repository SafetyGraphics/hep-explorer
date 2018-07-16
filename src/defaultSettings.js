const defaultSettings = {
    //Default template settings
    value_col: 'STRESN',
    measure_col: 'TEST',
    visit_col: 'VISIT',
    visitn_col: 'VISITN',
    studyday_col: 'DY',
    unit_col: 'STRESU',
    normal_col_low: 'STNRLO',
    normal_col_high: 'STNRHI',
    id_col: 'USUBJID',
    group_cols: null,
    filters: null,
    details: null,
    measure_details: [
        {
            label: 'ALT',
            measure: 'Aminotransferase, alanine (ALT)',
            axis: 'x',
            imputation: 'data-driven',
            cut: {
                relative_baseline: 3.8,
                relative_uln: 3,
                absolute: 1.0
            }
        },
        {
            label: 'ALP',
            measure: 'Alkaline phosphatase (ALP)',
            axis: null,
            imputation: 'data-driven',
            cut: {
                relative_baseline: 3.8,
                relative_uln: 1,
                absolute: 1.0
            }
        },
        {
            label: 'TB',
            measure: 'Total Bilirubin',
            axis: 'y',
            imputation: 'data-driven',
            cut: {
                relative_baseline: 4.8,
                relative_uln: 2,
                absolute: 40
            }
        }
    ],
    missingValues: ['', 'NA', 'N/A'],
    axis_options: [
        { label: 'Upper limit of normal adjusted (eDish)', value: 'relative_uln' },
        { label: 'Baseline adjusted (mDish)', value: 'relative_baseline' },
        { label: 'Raw Values', value: 'absolute' }
    ],
    display: 'relative_uln', //or "relative_baseline" or "absolute"
    baseline_visitn: '1',
    measureBounds: [0.01, 0.99],
    populationProfileURL: null,
    participantProfileURL: null,
    point_size: 'Uniform',
    visit_window: 30,

    //Standard webcharts settings
    x: {
        column: null, //set in onPreprocess/updateAxisSettings
        label: null, // set in onPreprocess/updateAxisSettings,
        type: 'linear',
        behavior: 'raw',
        format: '.2f'
        //domain: [0, null]
    },
    y: {
        column: null, // set in onPreprocess/updateAxisSettings,
        label: null, // set in onPreprocess/updateAxisSettings,
        type: 'linear',
        behavior: 'raw',
        format: '.2f'
        //domain: [0, null]
    },
    marks: [
        {
            per: [], // set in syncSettings()
            type: 'circle',
            summarizeY: 'mean',
            summarizeX: 'mean',
            attributes: { 'fill-opacity': 0 }
        }
    ],
    gridlines: 'xy',
    color_by: null, //set in syncSettings
    max_width: 600,
    aspect: 1,
    legend: { location: 'top' },
    margin: { right: 25, top: 25, bottom: 75 }
};

//Replicate settings in multiple places in the settings object
export function syncSettings(settings) {
    settings.marks[0].per[0] = settings.id_col;

    //set grouping config
    if (!(settings.group_cols instanceof Array && settings.group_cols.length)) {
        settings.group_cols = [{ value_col: 'NONE', label: 'None' }];
    } else {
        settings.group_cols = settings.group_cols.map(group => {
            return {
                value_col: group.value_col || group,
                label: group.label || group.value_col || group
            };
        });

        const hasNone = settings.group_cols.map(m => m.value_col).indexOf('NONE') > -1;
        if (!hasNone) {
            settings.group_cols.unshift({ value_col: 'NONE', label: 'None' });
        }
    }

    if (settings.group_cols.length > 1) {
        settings.color_by = settings.group_cols[1].value_col
            ? settings.group_cols[1].value_col
            : settings.group_cols[1];
    } else {
        settings.color_by = 'NONE';
    }

    //Define default details.
    let defaultDetails = [{ value_col: settings.id_col, label: 'Subject Identifier' }];
    if (settings.filters) {
        settings.filters.forEach(function(filter) {
            var obj = {
                value_col: filter.value_col ? filter.value_col : filter,
                label: filter.label ? filter.label : filter.value_col ? filter.value_col : filter
            };

            if (defaultDetails.find(f => f.value_col == obj.value_col) == undefined) {
                defaultDetails.push(obj);
            }
        });
    }

    if (settings.group_cols) {
        settings.group_cols.filter(f => f.value_col != 'NONE').forEach(function(group) {
            var obj = {
                value_col: group.value_col ? group.value_col : filter,
                label: group.label ? group.label : group.value_col ? group.value_col : filter
            };
            if (defaultDetails.find(f => f.value_col == obj.value_col) == undefined) {
                defaultDetails.push(obj);
            }
        });
    }

    //If [settings.details] is not specified:
    if (!settings.details) settings.details = defaultDetails;
    else {
        //If [settings.details] is specified:
        //Allow user to specify an array of columns or an array of objects with a column property
        //and optionally a column label.
        settings.details.forEach(detail => {
            if (
                defaultDetails
                    .map(d => d.value_col)
                    .indexOf(detail.value_col ? detail.value_col : detail) === -1
            )
                defaultDetails.push({
                    value_col: detail.value_col ? detail.value_col : detail,
                    label: detail.label
                        ? detail.label
                        : detail.value_col ? detail.value_col : detail
                });
        });
        settings.details = defaultDetails;
    }

    return settings;
}

//Map values from settings to control inputs
export function syncControlInputs(settings) {
    var defaultControls = [
        {
            type: 'dropdown',
            label: 'Group',
            description: 'Grouping Variable',
            options: ['color_by'],
            start: null, // set in syncControlInputs()
            values: ['NONE'], // set in syncControlInputs()
            require: true
        },
        {
            type: 'dropdown',
            label: 'Display Type',
            description: 'Relative or Absolute Axes',
            options: ['displayLabel'],
            start: null, // set in syncControlInputs()
            values: null, // set in syncControlInputs()
            //    labels: ['Proportion of ULN', 'Proportion of Baseline', 'Raw Values'],
            require: true
        },
        {
            type: 'number',
            label: 'ALT Cutpoint',
            description: 'X-axis cut',
            option: 'quadrants.cut_data.x'
        },
        {
            type: 'number',
            label: 'TB Cutpoint',
            description: 'Y-axis cut',
            option: 'quadrants.cut_data.y'
        },
        {
            type: 'dropdown',
            label: 'Point Size',
            description: 'Parameter to set point radius',
            options: ['point_size'],
            start: 'None', // set in syncControlInputs()
            values: ['Uniform'],
            require: true
        },
        {
            type: 'dropdown',
            label: 'Axis Type',
            description: 'Linear or Log Axes',
            options: ['x.type', 'y.type'],
            start: null, // set in syncControlInputs()
            values: ['linear', 'log'],
            require: true
        },
        {
            type: 'number',
            label: 'Highlight Points Based on Timing',
            description: 'Fill points with max values less than X days apart',
            option: 'visit_window'
            //  start: false, // set in syncControlInputs()
            //  require: true
        }
    ];

    //Sync group control.
    const groupControl = defaultControls.find(controlInput => controlInput.label === 'Group');
    groupControl.start = settings.color_by;
    settings.group_cols.filter(group => group.value_col !== 'NONE').forEach(group => {
        groupControl.values.push(group.value_col);
    });

    //drop the group control if NONE is the only option
    if (settings.group_cols.length == 1) {
        defaultControls = defaultControls.filter(controlInput => controlInput.label != 'Group');
    }

    //Sync point size control.
    const pointSizeControl = defaultControls.find(
        controlInput => controlInput.label === 'Point Size'
    );
    settings.measure_details.filter(f => (f.axis != 'x') & (f.axis != 'y')).forEach(group => {
        pointSizeControl.values.push(group.label);
    });

    //drop the pointSize control if NONE is the only option
    if (settings.measure_details.length == 2) {
        defaultControls = defaultControls.filter(
            controlInput => controlInput.label != 'Point Size'
        );
    }

    //Sync display control
    const displayControl = defaultControls.filter(
        controlInput => controlInput.label === 'Display Type'
    )[0];
    displayControl.values = settings.axis_options.map(m => m.label);

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
        return defaultControls.concat(otherFilters);
    } else return defaultControls;
}

export default defaultSettings;
