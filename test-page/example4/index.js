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
        },
        {
            value_col: 'SUBJID',
            label: 'ID'
        }
    ],
    measure_values:{
        'ALT':'ALT (SGPT)',
        'AST':'AST (SGOT)',
        'TB':'Total Bilirubin',
        'ALP':"Alkaline Phosphatase",
        'GGT':"GGT",
        "LDH":"LDH"
    },
    cuts:{
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
      GGT: {
        relative_baseline: 3.8,
        relative_uln: 3,
        absolute: 20
      },
      LDH: {
        relative_baseline: 3.8,
        relative_uln: 3,
        absolute: 200
      }
    },
    x_options:['ALT', 'AST', 'ALP','GGT',"LDH"],
    y_options:['TB', 'GGT', "LDH"],
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
d3.csv('../example2/allQuads.csv', function(data) {
    data.forEach(function(d){
        d.EPOCH = +d.STUDYDAY > 1 ? "Analysis" : "Baseline";
        d.AgeGroup = +d.AGE < 60 ?  "<60":"60+";
    })
    chart.init(data);
});
