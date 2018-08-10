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
                label: 'AST',
                measure: 'Aminotransferase, aspartate (AST)',
                axis: 'x',
                imputation: 'data-driven',
                cut: {
                    relative_baseline: 3.8,
                    relative_uln: 3,
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
            },
            {
                label: 'ALP',
                measure: 'Alkaline phosphatase (ALP)',
                axis: 'z',
                imputation: 'data-driven',
                cut: {
                    relative_baseline: 3.8,
                    relative_uln: 1,
                    absolute: 1.0
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
        showTitle: true,

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
