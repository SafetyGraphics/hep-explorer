const dm = fetch('https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/sdtm/cdisc-pilot-01/dm.csv')
    .then(function(response) { return response.text(); });
const lb = fetch('https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/sdtm/cdisc-pilot-01/lb.csv')
    .then(function(response) { return response.text(); });
const ex = fetch('https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/sdtm/cdisc-pilot-01/ex.csv')
    .then(function(response) { return response.text(); });
Promise.all([dm,lb,ex])
    .then(function(values) {
        return {
            dm: d3.csv.parse(values[0]),
            lb: d3.csv.parse(values[1]),
            ex: d3.csv.parse(values[2])
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
                group_cols: 'ARM',
            } // settings
        );
        data.dm.forEach(function(d) {
            data.lb
                .filter(di => di.USUBJID === d.USUBJID)
                .forEach(di => {
                    Object.assign(di,d);
                });
        });
        data.ex.forEach(function(d,i) {
            //Make some timepoints in addition to time intervals.
            if (d.EXSEQ === '1') d.EXENDY = d.EXSTDY;
            if (d.EXSEQ === '3') d.EXSTDY = d.EXENDY;
        });
        instance.init(data.lb, data.ex);

        return instance;
    });
