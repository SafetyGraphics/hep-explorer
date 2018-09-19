import { addSparkLines } from './addSparkLines';
export function drawMeasureTable(d) {
    var chart = this;
    var config = chart.config;
    var allMatches = d.values.raw[0].raw;
    var ranges = d3
        .nest()
        .key(d => d[config.measure_col])
        .rollup(function(d) {
            var vals = d.map(m => m[config.value_col]).sort((a, b) => a - b);
            var lower_extent = d3.quantile(vals, config.measureBounds[0]),
                upper_extent = d3.quantile(vals, config.measureBounds[1]);
            return [lower_extent, upper_extent];
        })
        .entries(chart.initial_data);

    //make nest by measure
    var nested = d3
        .nest()
        .key(d => d[config.measure_col])
        .rollup(function(d) {
            var measureObj = {};
            measureObj.key = d[0][config.measure_col];
            measureObj.raw = d;
            measureObj.values = d.map(d => +d[config.value_col]);
            measureObj.max = +d3.format('0.2f')(d3.max(measureObj.values));
            measureObj.min = +d3.format('0.2f')(d3.min(measureObj.values));
            measureObj.median = +d3.format('0.2f')(d3.median(measureObj.values));
            measureObj.n = measureObj.values.length;
            measureObj.spark = 'spark!';
            measureObj.population_extent = ranges.find(f => measureObj.key == f.key).values;
            measureObj.spark_data = d.map(function(m) {
                return {
                    visitn: +m[config.visitn_col],
                    value: +m[config.value_col],
                    lln: +m[config.normal_col_low],
                    uln: +m[config.normal_col_high]
                };
            });
            return measureObj;
        })
        .entries(allMatches);

    var nested = nested
        .map(function(m) {
            return m.values;
        })
        .sort(function(a, b) {
            var a_order = Object.values(config.measure_values).indexOf(a.key);
            var b_order = Object.values(config.measure_values).indexOf(b.key);
            return b_order - a_order;
        });

    //draw the measure table
    this.participantDetails.wrap.selectAll('*').style('display', null);
    this.measureTable.on('draw', addSparkLines);
    this.measureTable.draw(nested);
}
