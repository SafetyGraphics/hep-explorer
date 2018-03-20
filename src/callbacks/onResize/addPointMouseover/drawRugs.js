//draw marginal rug for visit-level measures
export function drawRugs(d, axis) {
    var chart = this;
    var config = this.config;

    //get matching measures
    var allMatches = d.values.raw[0].raw,
        measure = config.measure_details.find(f => config[axis].column.search(f.label) > -1)
            .measure,
        matches = allMatches.filter(f => f[config.measure_col] == measure);

    //draw the rug
    var min_value = axis == 'x' ? chart.y.domain()[0] : chart.x.domain()[0];
    chart[axis + '_rug']
        .selectAll('text')
        .data(matches)
        .enter()
        .append('text')
        .attr('class', 'rug-tick')
        .attr(
            'x',
            d =>
                axis == 'x'
                    ? config.display == 'relative'
                        ? chart.x(d.relative)
                        : chart.x(d[config.measure_col])
                    : chart.x(min_value)
        )
        .attr(
            'y',
            d =>
                axis == 'y'
                    ? config.display == 'relative'
                        ? chart.y(d.relative)
                        : chart.y(d[config.measure_col])
                    : chart.y(min_value)
        )
        .attr('dy', axis == 'x' ? '-0.2em' : null)
        .attr('stroke', d => chart.colorScale(d[config.color_by]))
        .text(d => (axis == 'x' ? '|' : '–'))
        .append('svg:title')
        .text(
            d =>
                d[config.measure_col] +
                '=' +
                d3.format('.2f')(d[config.value_col]) +
                ' (' +
                d3.format('.2f')(d.relative) +
                ' xULN) @ ' +
                d[config.visit_col]
        );
}
