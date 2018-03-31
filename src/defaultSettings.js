const defaultSettings = {
    //Default template settings
    value_col: 'STRESN',
    measure_col: 'TEST',
    visit_col: 'VISIT',
    visitn_col: 'VISITN',
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
            cut: {
                relative: 3,
                absolute: 1.0
            }
        },
        {
            label: 'ALP',
            measure: 'Alkaline phosphatase (ALP)',
            axis: 'z', //used to fill circles
            cut: {
                relative: 1,
                absolute: 1.0
            }
        },
        {
            label: 'TB',
            measure: 'Total Bilirubin',
            axis: 'y',
            cut: {
                relative: 2,
                absolute: 40
            }
        }
    ],
    missingValues: ['', 'NA', 'N/A'],
    display: 'relative', //or "absolute"
    baseline_visitn: '1',
    populationProfileURL: null,
    participantProfileURL: null,

    //Standard webcharts settings
    x: {
        column: null, //set in onPreprocess/updateAxisSettings
        label: null, // set in onPreprocess/updateAxisSettings,
        type: 'linear',
        behavior: 'flex',
        format: '.1f',
        domain: [0, null]
    },
    y: {
        column: null, // set in onPreprocess/updateAxisSettings,
        label: null, // set in onPreprocess/updateAxisSettings,
        type: 'linear',
        behavior: 'flex',
        format: '.1f',
        domain: [0, null]
    },
    marks: [
        {
            per: [], // set in syncSettings()
            type: 'circle',
            summarizeY: 'mean',
            summarizeX: 'mean',
            attributes: { 'fill-opacity': 0.5 }
        }
    ],
    gridlines: 'xy',
    color_by: null, //set in syncSettings
    max_width: 500,
    aspect: 1,
    legend: { location: 'top' },
    margin: { right: 25, top: 25 }
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
    if (settings.filters)
        settings.filters.forEach(filter =>
            defaultDetails.push({
                value_col: filter.value_col ? filter.value_col : filter,
                label: filter.label ? filter.label : filter.value_col ? filter.value_col : filter
            })
        );
    if (settings.group_cols)
        settings.group_cols.filter(f => f.value_col != 'NONE').forEach(group =>
            defaultDetails.push({
                value_col: group.value_col ? group.value_col : filter,
                label: group.label ? group.label : group.value_col ? group.value_col : filter
            })
        );
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
            options: ['display', 'quadrants.cut_data.displayChange'],
            start: null, // set in syncControlInputs()
            values: ['relative', 'absolute'],
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
            type: 'number',
            label: 'Baseline ALP Cutpoint',
            description: 'Points > cutpoint @ baseline are filled',
            option: 'quadrants.cut_data.z'
        }
    ];
    //Sync group control.
    const groupControl = defaultControls.filter(controlInput => controlInput.label === 'Group')[0];
    groupControl.start = settings.color_by;
    settings.group_cols.filter(group => group.value_col !== 'NONE').forEach(group => {
        groupControl.values.push(group.value_col);
    });

    //drop the group control if NONE is the only option
    if (settings.group_cols.length == 1) {
        defaultControls = defaultControls.filter(controlInput => controlInput.label != 'Group');
    }

    //Sync display control
    const displayControl = defaultControls.filter(
        controlInput => controlInput.label === 'Display Type'
    )[0];
    groupControl.start = settings.display;

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
