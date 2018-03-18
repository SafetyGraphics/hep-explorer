const defaultSettings = {
    //Default template settings
    value_col: 'STRESN',
    measure_col: 'TEST',
    measure_details: [
        {
            label: 'ALT',
            measure: 'Aminotransferase, alanine (ALT)',
            cut: {
                relative: 3,
                absolute: null
            }
        },
        {
            label: 'ALP',
            measure: 'Alkaline phosphatase (ALP)',
            cut: {
                relative: 1,
                absolute: null
            }
        },
        {
            label: 'TB',
            measure: 'Total Bilirubin',
            cut: {
                relative: 2,
                absolute: null
            }
        }
    ],
    unit_col: 'STRESU',
    normal_range: true,
    normal_col_low: 'STNRLO',
    normal_col_high: 'STNRHI',
    id_col: 'USUBJID',
    group_col: null,
    filters: null,
    details: null,
    missingValues: ['', 'NA', 'N/A'],
    display: 'relative', //or "absolute"

    //Standard webcharts settings
    x: {
        column: 'ALT_relative',
        label: 'ALT (% ULN)',
        type: 'linear',
        behavior: 'flex',
        format: '.1f'
    },
    y: {
        column: 'TB_relative',
        label: 'TB (% ULN)',
        type: 'linear',
        behavior: 'flex',
        format: '.1f'
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
    color_by: 'ALP_relative_flagged',
    max_width: 500,
    aspect: 1
};

//Replicate settings in multiple places in the settings object
export function syncSettings(settings) {
    settings.marks[0].per[0] = settings.id_col;

    //Define default details.
    let defaultDetails = [{ value_col: settings.id_col, label: 'Subject Identifier' }];
    if (settings.filters)
        settings.filters.forEach(filter =>
            defaultDetails.push({
                value_col: filter.value_col ? filter.value_col : filter,
                label: filter.label ? filter.label : filter.value_col ? filter.value_col : filter
            })
        );
    defaultDetails.push({ value_col: settings.value_col, label: 'Result' });
    if (settings.normal_col_low)
        defaultDetails.push({ value_col: settings.normal_col_low, label: 'Lower Limit of Normal' });
    if (settings.normal_col_high)
        defaultDetails.push({
            value_col: settings.normal_col_high,
            label: 'Upper Limit of Normal'
        });

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
    const defaultControls = [
        {
            type: 'number',
            label: 'ALT Cutpoint',
            option: 'quadrants.cut_data.x'
        },
        {
            type: 'number',
            label: 'TB Cutpoint',
            option: 'quadrants.cut_data.y'
        }
    ];

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
