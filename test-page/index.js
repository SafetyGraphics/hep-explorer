d3.csv(
    'https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/sdtm/lb.csv',
    function(d,i) {
        return d;
    },
    function(data) {
        const instance = safetyedish(
            '#container', // element
            {
                visit_col: 'VISIT',
                visitn_col: 'VISITNUM',
                studyday_col: 'LBDY',
                measure_col: 'LBTEST',
                value_col: 'LBSTRESN',
                normal_col_low: 'LBSTNRLO',
                normal_col_high: 'LBSTNRHI',
            } // settings
        );
        instance.init(data);
    }
);
