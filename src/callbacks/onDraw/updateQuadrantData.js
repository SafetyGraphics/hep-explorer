export function updateQuadrantData() {
    const chart = this;
    const config = this.config;

    //add "eDISH_quadrant" column to raw_data
    const x_var = this.config.x.column;
    const y_var = this.config.y.column;

    const x_cut = this.config.cuts[x_var][config.display];
    const y_cut = this.config.cuts[y_var][config.display];

    this.filtered_data.forEach(function(d) {
        var x_cat = d[x_var] >= x_cut ? 'xHigh' : 'xNormal';
        var y_cat = d[y_var] >= y_cut ? 'yHigh' : 'yNormal';
        d['eDISH_quadrant'] = x_cat + ':' + y_cat;
    });

    //update Quadrant data
    config.quadrants.forEach(function(quad) {
        quad.count = chart.filtered_data.filter(d => d.eDISH_quadrant == quad.dataValue).length;
        quad.total = chart.filtered_data.length;
        quad.percent = d3.format('0.1%')(quad.count / quad.total);
    });
}
