export default function settings() {
    return {
        //Default template settings
        value_col: 'STRESN',
        measure_col: 'TEST',
        visit_col: 'VISIT',
        visitn_col: 'VISITNUM',
        studyday_col: 'DY',
        unit_col: 'STRESU',
        normal_col_low: 'STNRLO',
        normal_col_high: 'STNRHI',
        id_col: 'USUBJID',
        group_cols: null,
        filters: null,
        details: null,
        r_ratio_filter: true,
        r_ratio_cut: 0,
        measure_values: {
            ALT: 'Aminotransferase, alanine (ALT)',
            AST: 'Aminotransferase, aspartate (AST)',
            TB: 'Total Bilirubin',
            ALP: 'Alkaline phosphatase (ALP)'
        },
        x_options: ['ALT', 'AST', 'ALP'],
        y_options: ['TB'],
        size_options: ['ALT', 'ASP', 'ALP', 'TB'],
        cuts: {
            ALT: {
                relative_baseline: 3.8,
                relative_uln: 3,
                absolute: 1.0
            },
            AST: {
                relative_baseline: 3.8,
                relative_uln: 3,
                absolute: 1.0
            },
            TB: {
                relative_baseline: 4.8,
                relative_uln: 2,
                absolute: 40
            },
            ALP: {
                relative_baseline: 3.8,
                relative_uln: 1,
                absolute: 1.0
            },
            xMeasure: null, //set in syncSettings
            yMeasure: null, //set in syncSettings
            display: null //set in syncSettings
        },
        imputation_methods: {
            ALT: 'data-driven',
            AST: 'data-driven',
            TB: 'data-driven',
            ALP: 'data-driven'
        },
        imputation_values: null,
        missingValues: ['', 'NA', 'N/A'],
        display: 'relative_uln', //or "relative_baseline" or "absolute"
        display_options: [
            { label: 'Upper limit of normal adjusted (eDish)', value: 'relative_uln' },
            { label: 'Baseline adjusted (mDish)', value: 'relative_baseline' },
            { label: 'Raw Values', value: 'absolute' }
        ],
        baseline_visitn: '1',
        measureBounds: [0.01, 0.99],
        populationProfileURL: null,
        participantProfileURL: null,
        point_size: 'Uniform',
        visit_window: 30,
        showTitle: true,
        quadrants: [
            //all values set in onLayout/quadrants/*.js
            {
                label: "Possible Hy's Law Range",
                position: 'upper-right',
                dataValue: 'xHigh:yHigh',
                count: null,
                total: null,
                percent: null
            },
            {
                label: 'Hyperbilirubinemia',
                position: 'upper-left',
                dataValue: 'xNormal:yHigh',
                count: null,
                total: null,
                percent: null
            },
            {
                label: "Temple's Corollary",
                position: 'lower-right',
                dataValue: 'xHigh:yNormal',
                count: null,
                total: null,
                percent: null
            },
            {
                label: 'Normal Range',
                position: 'lower-left',
                dataValue: 'xNormal:yNormal',
                count: null,
                total: null,
                percent: null
            }
        ],
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
}
