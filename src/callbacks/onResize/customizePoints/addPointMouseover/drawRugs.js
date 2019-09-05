//draw marginal rug for visit-level measures
export function drawRugs(d, axis) {
    var chart = this;
    var config = this.config;

    //get matching measures
    var allMatches = d.values.raw[0].raw;
    const measure = config.measure_values[config[axis].column];
    const matches = allMatches.filter(f => f[config.measure_col] == measure);

    //draw the rug
    var min_value = axis == 'x' ? chart.y.domain()[0] : chart.x.domain()[0];
    var rugs = chart[axis + '_rug']
        .selectAll('text')
        .data(matches)
        .enter()
        .append('text')
        .attr({
            class: 'rug-tick',
            x: di => (axis === 'x' ? chart.x(di[config.display]) : chart.x(min_value)),
            y: di => (axis === 'y' ? chart.y(di[config.display]) : chart.y(min_value)),
            dy: axis === 'y' ? 4 : 0,
            'text-anchor': axis === 'y' ? 'end' : null,
            'alignment-baseline': axis === 'x' ? 'hanging' : null,
            'font-size': axis === 'x' ? '6px' : null,
            stroke: di => chart.colorScale(di[config.color_by]),
            'stroke-width': di => (di[config.display] === d.values[axis] ? '3px' : '1px')
        })
        .text(d => (axis === 'x' ? '|' : '–'));

    //Add tooltips to rugs.
    rugs.append('svg:title').text(
        d =>
            d[config.measure_col] +
            '=' +
            d3.format('.2f')(d.absolute) +
            ' (' +
            d3.format('.2f')(d.relative_uln) +
            ' xULN) @ ' +
            d[config.visit_col] +
            '/Study Day ' +
            d[config.studyday_col]
    );
}
