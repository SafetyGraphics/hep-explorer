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
    chart[axis + '_rug']
        .selectAll('text')
        .data(matches)
        .enter()
        .append('text')
        .attr('class', 'rug-tick')
        .attr('x', d => (axis == 'x' ? chart.x(d[config.display]) : chart.x(min_value)))
        .attr('y', d => (axis == 'y' ? chart.y(d[config.display]) : chart.y(min_value)))
        //        .attr('dy', axis == 'x' ? '-0.2em' : null)
        .attr('text-anchor', axis == 'y' ? 'end' : null)
        .attr('alignment-baseline', axis == 'x' ? 'hanging' : null)
        .attr('font-size', axis == 'x' ? '6px' : null)
        .attr('stroke', d => chart.colorScale(d[config.color_by]))
        .attr('stroke-width', d =>
            d[this.config.studyday_col] <= this.config.plot_day ? '5px' : '1px'
        )
        .text(d => (axis == 'x' ? '|' : '–'))
        .append('svg:title')
        .text(
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
