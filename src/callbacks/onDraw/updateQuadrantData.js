export function updateQuadrantData() {
    var chart = this;
    var config = this.config;
    //update cut data
    var dimensions = ['x', 'y'];
    dimensions.forEach(function(dimension) {
        var cut = config.measure_details.find(f => config[dimension].column.search(f.label) > -1)
            .cut[config.display];

        chart.quadrants.cut_data.filter(f => f.dimension == dimension)[0].value = cut;
        chart.quadrants.cut_data[dimension] = cut; //save the cut value as a prop on the array
    });

    //add "eDISH_quadrant" column to raw_data
    const x_var = this.config.x.column;
    const y_var = this.config.y.column;
    this.raw_data.forEach(function(d) {
        var x_cat = d[x_var] >= chart.quadrants.cut_data.x ? 'xHigh' : 'xNormal';
        var y_cat = d[y_var] >= chart.quadrants.cut_data.y ? 'yHigh' : 'yNormal';
        d['eDISH_quadrant'] = x_cat + ':' + y_cat;
    });

    //update Quadrant data
    this.quadrants.quadrant_data.forEach(function(quad) {
        quad.count = chart.raw_data.filter(d => d.eDISH_quadrant == quad.dataValue).length;
        quad.total = chart.raw_data.length;
        quad.percent = d3.format('0.1%')(quad.count / quad.total);
    });

    console.log(this.quadrants.quadrant_data);
}
