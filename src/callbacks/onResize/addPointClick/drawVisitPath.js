export function drawVisitPath(d) {
    var chart = this;
    var config = chart.config;

    var allMatches = d.values.raw[0].raw,
        x_measure = config.measure_details.find(f => config.x.column.search(f.label) > -1).measure,
        y_measure = config.measure_details.find(f => config.y.column.search(f.label) > -1).measure,
        matches = allMatches.filter(
            f => f[config.measure_col] == x_measure || f[config.measure_col] == y_measure
        );
    console.log(allMatches);

    //get coordinates by visit
    var visits = d3.set(matches.map(m => m[config.visitn_col])).values();
    var visit_data = visits
        .map(function(m) {
            var visitObj = {};
            visitObj.visitn = +m;
            visitObj.visit = matches.filter(f => f[config.visitn_col] == m)[0][config.visit_col];
            visitObj[config.color_by] = matches[0][config.color_by];
            //get x coordinate
            var x_match = matches
                .filter(f => f[config.visitn_col] == m)
                .filter(f => f[config.measure_col] == x_measure)[0];
            visitObj.x =
                config.display == 'relative' ? x_match.relative : x_match[config.value_col];

            //get y coordinate
            var y_match = matches
                .filter(f => f[config.visitn_col] == m)
                .filter(f => f[config.measure_col] == y_measure)[0];

            visitObj.y =
                config.display == 'relative' ? y_match.relative : y_match[config.value_col];

            return visitObj;
        })
        .sort(function(a, b) {
            return a.visitn - b.visitn;
        });

    //draw the path
    var myLine = d3.svg
        .line()
        .x(d => chart.x(d.x))
        .y(d => chart.y(d.y));

    chart.visitPath.selectAll('*').remove();
    chart.visitPath.moveToFront();
    chart.visitPath
        .append('path')
        .attr('class', 'participant-visits')
        .datum(visit_data)
        .attr('d', myLine)
        .attr('stroke', '#ccc')
        .attr('stroke-width', '1px')
        .attr('fill', 'none');

    //draw visit points
    var visitPoints = chart.visitPath
        .selectAll('g.visit-point')
        .data(visit_data)
        .enter()
        .append('g')
        .attr('class', 'visit-point');

    var maxPoint = d;
    visitPoints
        .append('circle')
        .attr('class', 'participant-visits')
        .attr('fill', 'white')
        .attr('stroke', d => chart.colorScale(d[config.color_by]))
        .attr('stroke-width', d => ((d.x == maxPoint.x) & (d.y == maxPoint.y) ? 3 : 1))
        .attr('cx', d => chart.x(d.x))
        .attr('cy', d => chart.y(d.y))
        .attr('r', 6);

    //draw visit numbers
    visitPoints
        .append('text')
        .text(d => d.visitn)
        .attr('class', 'participant-visits')
        .attr('stroke', 'none')
        .attr('fill', d => chart.colorScale(d[config.color_by]))
        .attr('x', d => chart.x(d.x))
        .attr('y', d => chart.y(d.y))
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', 8);
}
