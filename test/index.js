document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        //Load local build if in local environment.
        if (window.origin !== 'https: //rhoinc.github.io') {
            var head = document.getElementsByTagName('head')[0];

            //...load local build.
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = '../build/safetyedish.js';
            head.appendChild(script);
        }

        let settings = {
            max_width: 600,
            value_col: 'AVAL',
            measure_col: 'PARAM',
            visitn_col: 'VISITNUM',
            studyday_col: 'ADY',
            normal_col_low: 'A1LO',
            normal_col_high: 'A1HI',
            id_col: 'USUBJID',
            group_cols: ['TRTA','RACE','AGEGR1'],
            filters: [
                {
                    value_col: 'TRTA',
                    label: 'Treatment'
                },
                {
                    value_col: 'SEX',
                    label: 'Sex'
                },
                {
                    value_col: 'RACE',
                    label: 'Race'
                },
                {
                    value_col: 'AGEGR1',
                    label: 'Age group'
                },
            ],
            measure_details: [
                {
                    label: 'ALT',
                    measure: 'Alanine Aminotransferase (U/L)',
                    axis: 'x',
                    imputation: 'data-driven',
                    cut: {
                        relative_uln: 3,
                        absolute: 3.8,
                        relative_baseline: 3.8
                    }
                },
                {
                    label: 'AST',
                    measure: 'Aspartate Aminotransferase (U/L)',
                    axis: 'x',
                    imputation: 'data-driven',
                    cut: {
                        relative_uln: 3,
                        absolute: 3.8,
                        relative_baseline: 3.8
                    }
                },
                {
                    label: 'ALP',
                    measure: 'Alkaline Phosphatase (U/L)',
                    axis: 'z', //used to fill circles
                    imputation: 'data-driven',
                    cut: {
                        relative_uln: 3,
                        absolute: 3,
                        relative_baseline: 3.8
                    }
                },
                {
                    label: 'TB',
                    measure: 'Bilirubin (umol/L)',
                    axis: 'y',
                    imputation: 'data-driven',
                    cut: {
                        relative_uln: 2,
                        absolute: 2,
                        relative_baseline: 4.8
                    }
                }
            ]
        };
        settings = {};

        const chart = safetyedish('#container', settings);
        //d3.csv('adlbhy.csv', function(data) {
        //    chart.init(data);
        //});
        d3.csv('../../viz-library/data/safetyData/ADBDS.csv', function(data) {
            chart.init(data);
        });
    }
}
