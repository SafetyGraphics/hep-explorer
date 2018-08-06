export default function controlInputs() {
    return [
        {
            type: 'dropdown',
            label: 'Group',
            description: 'Grouping variable',
            options: ['color_by'],
            start: null, // set in syncControlInputs()
            values: ['NONE'], // set in syncControlInputs()
            require: true
        },
        {
            type: 'dropdown',
            label: 'Display Type',
            description: 'Relative or absolute axes',
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
        },
        {
            type: 'number',
            label: 'Minimum R Ratio',
            description: 'Display points with R ratios greater or equal to X',
            option: 'r_ratio_cut'
        }
    ];
}
