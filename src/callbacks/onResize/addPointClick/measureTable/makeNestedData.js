export function makeNestedData(d) {
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
            measureObj.eDish = chart;
            measureObj.key = d[0][config.measure_col];
            measureObj.raw = d;
            measureObj.values = d.map(d => +d[config.value_col]);
            measureObj.max = +d3.format('0.2f')(d3.max(measureObj.values));
            measureObj.min = +d3.format('0.2f')(d3.min(measureObj.values));
            measureObj.median = +d3.format('0.2f')(d3.median(measureObj.values));
            measureObj.n = measureObj.values.length;
            measureObj.spark = 'spark!';
            measureObj.population_extent = ranges.find(f => measureObj.key == f.key).values;
            var hasColor =
                chart.spaghetti.colorScale.domain().indexOf(d[0][config.measure_col]) > -1;
            measureObj.color = hasColor
                ? chart.spaghetti.colorScale(d[0][config.measure_col])
                : 'black';
            measureObj.spark_data = d.map(function(m) {
                var obj = {
                    id: +m[config.id_col],
                    lab: +m[config.measure_col],
                    visitn: +m[config.visitn_col],
                    value: +m[config.value_col],
                    lln: +m[config.normal_col_low],
                    uln: +m[config.normal_col_high],
                    population_extent: measureObj.population_extent,
                    outlier_low: +m[config.value_col] < +m[config.normal_col_low],
                    outlier_high: +m[config.value_col] > +m[config.normal_col_high]
                };
                obj.outlier = obj.outlier_low || obj.outlier_high;
                return obj;
            });
            return measureObj;
        })
        .entries(allMatches);

    var nested = nested
        .map(function(m) {
            return m.values;
        })
        .sort(function(a, b) {
            var a_order = Object.keys(config.measure_values)
                .map(e => config.measure_values[e])
                .indexOf(a.key);
            var b_order = Object.keys(config.measure_values)
                .map(e => config.measure_values[e])
                .indexOf(b.key);
            return b_order - a_order;
        });
    return nested;
}
