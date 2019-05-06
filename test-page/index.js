//const lb = fetch('https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/sdtm/cdisc-pilot-01/lb.csv')
//    .then(function(response) { return response.text(); });
//const ex = fetch('https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/sdtm/cdisc-pilot-01/ex.csv')
//    .then(function(response) { return response.text(); });
const lb = fetch('../../data-library/data/clinical-trials/sdtm/cdisc-pilot-01/lb.csv')
    .then(function(response) { return response.text(); });
const ex = fetch('../../data-library/data/clinical-trials/sdtm/cdisc-pilot-01/ex.csv')
    .then(function(response) { return response.text(); });
Promise.all([lb,ex])
    .then(function(values) {
        return {
            lb: d3.csv.parse(values[0]),
            ex: d3.csv.parse(values[1])
        };
    })
    .then(function(data) {
        const instance = safetyedish(
            '#container', // element
            {
                studyday_col: 'LBDY',
                value_col: 'LBSTRESN',
                measure_col: 'LBTEST',
                normal_col_low: 'LBSTNRLO',
                normal_col_high: 'LBSTNRHI',
                visit_col: 'VISIT',
                visitn_col: 'VISITNUM',
                measure_values: {
                    ALT: 'Alanine Aminotransferase',
                    AST: 'Aspartate Aminotransferase',
                    TB: 'Bilirubin',
                    ALP: 'Alkaline Phosphatase'
                },
                //baseline: {
                //    value_col: 'LBDY', //synced with studyday_col in syncsettings()
                //    values: [1]
                //},
                //measure_values: {
                //    ALT: 'Aminotransferase, alanine (ALT)',
                //    AST: 'Aminotransferase, aspartate (AST)',
                //    TB: 'Total Bilirubin',
                //    ALP: 'Alkaline phosphatase (ALP)'
                //},
            } // settings
        );
        instance.init(data.lb);
    });
