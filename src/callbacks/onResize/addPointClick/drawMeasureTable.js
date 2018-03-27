import { addSparkLines } from './addSparkLines';
export function drawMeasureTable(d) {
    var chart = this;
    var config = chart.config;
    var allMatches = d.values.raw[0].raw;

    //make nest by measure
    var nested = d3
        .nest()
        .key(d => d[config.measure_col])
        .rollup(function(d) {
            var measureObj = {};
            measureObj.raw = d;
            measureObj.values = d.map(d => +d[config.value_col]);
            measureObj.max = +d3.format('0.2f')(d3.max(measureObj.values));
            measureObj.min = +d3.format('0.2f')(d3.min(measureObj.values));
            measureObj.median = +d3.format('0.2f')(d3.median(measureObj.values));
            measureObj.n = measureObj.values.length;
            measureObj.spark = 'spark!';
            measureObj.spark_data = d.map(function(m) {
                return {
                    visitn: +m[config.visitn_col],
                    value: +m[config.value_col]
                };
            });

            return measureObj;
        })
        .entries(allMatches);

    var nested = nested.map(function(m) {
        m.values.key = m.key;
        return m.values;
    });

    //draw the measure table
    this.participantDetails.wrap.selectAll('*').style('display', null);
    this.measureTable.on('draw', addSparkLines);
    this.measureTable.draw(nested);
}
