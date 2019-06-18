const settings = {
    max_width: 600,
    value_col: 'AVAL',
    measure_col: 'PARAM',
    visit_col:"VISIT",
    visitn_col: 'VISITNUM',
    studyday_col: 'ADY',
    normal_col_low: 'A1LO',
    normal_col_high: 'A1HI',
    id_col: 'USUBJID',
    group_cols: ['TRTA','RACE','AGEGR1'],
    r_ratio_filter:false,
/*
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
*/
    measure_values:{
        'ALT':'Alanine Aminotransferase (U/L)',
        'AST':'Aspartate Aminotransferase (U/L)',
        'TB':'Bilirubin (umol/L)',
        'ALP':'Alkaline Phosphatase (U/L)'
    },
    baseline:{
        value_col:"AVISIT",
        values:["Baseline"]
    }
};
const chart = hepexplorer('#container', settings);
d3.csv('adlbc.csv', function(data) {
    data.forEach(function(d){
        d.EPOCH = +d.VISITNUM > 1 ? "Analysis" : "Baseline"
    })
    chart.init(data);
});
