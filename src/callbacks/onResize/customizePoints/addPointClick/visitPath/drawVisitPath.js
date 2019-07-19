export function drawVisitPath(d) {
    var chart = this;
    var config = chart.config;

    var allMatches = d.values.raw[0].raw;
    const x_measure = config.measure_values[config.x.column];
    const y_measure = config.measure_values[config.y.column];
    var matches = allMatches.filter(
        f => f[config.measure_col] == x_measure || f[config.measure_col] == y_measure
    );

    //get coordinates by visit
    var visits = d3.set(matches.map(m => m[config.studyday_col])).values();
    var visit_data = visits
        .map(function(m) {
            var visitObj = {};
            visitObj.studyday = +m;
            visitObj.visit = config.visit_col
                ? matches.filter(f => f[config.studyday_col] == m)[0][config.visit_col]
                : null;
            visitObj.visitn = config.visitn_col
                ? matches.filter(f => f[config.studyday_col] == m)[0][config.visitn_col]
                : null;
            visitObj[config.color_by] = matches[0][config.color_by];

            //get x coordinate
            var x_match = matches
                .filter(f => f[config.studyday_col] == m)
                .filter(f => f[config.measure_col] == x_measure);

            if (x_match.length) {
                visitObj.x = x_match[0][config.display];
                visitObj.xMatch = x_match[0];
            } else {
                visitObj.x = null;
                visitObj.xMatch = null;
            }

            //get y coordinate
            var y_match = matches
                .filter(f => f[config.studyday_col] == m)
                .filter(f => f[config.measure_col] == y_measure);
            if (y_match.length) {
                visitObj.y = y_match[0][config.display];
                visitObj.yMatch = y_match[0];
            } else {
                visitObj.y = null;
                visitObj.yMatch = null;
            }

            //get rRatio
            var rRatio_match = d.values.raw[0].rRatio_raw.filter(f => f[config.studyday_col] == m);
            visitObj.rRatio = rRatio_match.length ? rRatio_match[0].rRatio : null;

            return visitObj;
        })
        .sort(function(a, b) {
            return a.studyday - b.studyday;
        })
        .filter(f => (f.x > 0) & (f.y > 0));

    //draw the path
    var myLine = d3.svg
        .line()
        .x(d => chart.x(d.x))
        .y(d => chart.y(d.y));

    chart.visitPath.selectAll('*').remove();
    chart.visitPath.moveToFront();

    var path = chart.visitPath
        .append('path')
        .attr('class', 'participant-visits')
        .datum(visit_data)
        .attr('d', myLine)
        .attr('stroke', d => chart.colorScale(matches[0][config.color_by]))
        .attr('stroke-width', '2px')
        .attr('fill', 'none');

    //Little trick for animating line drawing
    var totalLength = path.node().getTotalLength();
    path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(2000)
        .ease('linear')
        .attr('stroke-dashoffset', 0);

    //draw visit points
    var visitPoints = chart.visitPath
        .selectAll('g.visit-point')
        .data(visit_data)
        .enter()
        .append('g')
        .attr('class', 'visit-point');

    visitPoints
        .append('circle')
        .attr('class', 'participant-visits')
        .attr('r', 0)
        .attr('stroke', d => chart.colorScale(d[config.color_by]))
        .attr('stroke-width', 1)
        .attr('cx', d => chart.x(d.x))
        .attr('cy', d => chart.y(d.y))
        .attr('fill', d => chart.colorScale(d[config.color_by]))
        .attr('fill-opacity', 0.5)
        .transition()
        .delay(2000)
        .duration(200)
        .attr('r', 4);

    //custom titles for points on mouseover
    visitPoints.append('title').text(function(d) {
        var xvar = config.x.column;
        var yvar = config.y.column;

        const studyday_label = 'Study day: ' + d.studyday + '\n',
            visitn_label = d.visitn ? 'Visit Number: ' + d.visitn + '\n' : '',
            visit_label = d.visit ? 'Visit: ' + d.visit + '\n' : '',
            x_label = config.x.label + ': ' + d3.format('0.3f')(d.x) + '\n',
            y_label = config.y.label + ': ' + d3.format('0.3f')(d.y),
            rRatio_label = d.rRatio ? '\nR Ratio: ' + d3.format('0.2f')(d.rRatio) : '';

        return studyday_label + visit_label + visitn_label + x_label + y_label + rRatio_label;
    });
}
