const settings = {
    max_width: 600,
    value_col: 'LBORRES',
    measure_col: 'TESTNAM',
    visit_col:"VISIT",
    //  visitn_col: 'VISITNUM',
    studyday_col: 'STUDYDAY',
    normal_col_low: 'LBORRESLO',
    normal_col_high: 'LBORRESHI',
    id_col: 'SUBJID',
    group_cols: ['TRTA','SEX'],
    filters: [
        {
            value_col: 'TRTA',
            label: 'Treatment'
        },
        {
            value_col: 'SEX',
            label: 'Sex'
        }
    ],
    measure_values:{
        'ALT':'ALT (SGPT)',
        'AST':'AST (SGOT)',
        'TB':'Total Bilirubin',
        'ALP':"Alkaline Phosphatase"
    },
    baseline:{
        value_col:"STUDYDAY",
        values:[1]
    },
    analysisFlag:{
        value_col:"EPOCH",
        values:["Analysis"]
    }
};
const chart = hepexplorer('#container', settings);
d3.csv('allQuads.csv', function(data) {
    data.forEach(function(d){
        d.EPOCH = +d.STUDYDAY > 1 ? "Analysis" : "Baseline";
        d.AgeGroup = +d.AGE < 60 ?  "<60":"60+";
    })
    chart.init(data);
});
