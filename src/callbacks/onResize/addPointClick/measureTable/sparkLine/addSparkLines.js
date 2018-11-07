export function addSparkLines(d) {
    if (this.data.raw.length > 0) {
        //don't try to draw sparklines if the table is empty
        this.tbody
            .selectAll('tr')
            .style('background', 'none')
            .style('border-bottom', '.5px solid black')
            .each(function(row_d) {
                //Spark line cell
                const cell = d3
                        .select(this)
                        .select('td.spark')
                        .classed('minimized', true)
                        .text(''),
                    toggle = cell
                        .append('span')
                        .html('&#x25BD;')
                        .style('cursor', 'pointer')
                        .style('color', '#999')
                        .style('vertical-align', 'middle'),
                    width = 100,
                    height = 25,
                    offset = 4,
                    overTime = row_d.spark_data.sort((a, b) => +a.studyday - +b.studyday),
                    color = row_d.color;

                var x = d3.scale
                    .linear()
                    .domain(d3.extent(overTime, m => m.studyday))
                    .range([offset, width - offset]);

                //y-domain includes 99th population percentile + any participant outliers
                var y_min = d3.min(d3.merge([row_d.values, row_d.population_extent])) * 0.99;
                var y_max = d3.max(d3.merge([row_d.values, row_d.population_extent])) * 1.01;
                var y = d3.scale
                    .linear()
                    .domain([y_min, y_max])
                    .range([height - offset, offset]);

                //render the svg
                var svg = cell
                    .append('svg')
                    .attr({
                        width: width,
                        height: height
                    })
                    .append('g');

                //draw the normal range polygon ULN and LLN
                var upper = overTime.map(function(m) {
                    return { studyday: m.studyday, value: m.uln };
                });
                var lower = overTime
                    .map(function(m) {
                        return { studyday: m.studyday, value: m.lln };
                    })
                    .reverse();
                var normal_data = d3.merge([upper, lower]).filter(m => m.value);

                var drawnormal = d3.svg
                    .line()
                    .x(d => x(d.studyday))
                    .y(d => y(d.value));

                var normalpath = svg
                    .append('path')
                    .datum(normal_data)
                    .attr({
                        class: 'normalrange',
                        d: drawnormal,
                        fill: '#eee',
                        stroke: 'none'
                    });

                //draw lines at the population guidelines
                svg.selectAll('lines.guidelines')
                    .data(row_d.population_extent)
                    .enter()
                    .append('line')
                    .attr('class', 'guidelines')
                    .attr('x1', 0)
                    .attr('x2', width)
                    .attr('y1', d => y(d))
                    .attr('y2', d => y(d))
                    .attr('stroke', '#ccc')
                    .attr('stroke-dasharray', '2 2');

                //draw the sparkline
                var draw_sparkline = d3.svg
                    .line()
                    .interpolate('cardinal')
                    .x(d => x(d.studyday))
                    .y(d => y(d.value));
                var sparkline = svg
                    .append('path')
                    .datum(overTime)
                    .attr({
                        class: 'sparkLine',
                        d: draw_sparkline,
                        fill: 'none',
                        stroke: color
                    });

                //draw outliers
                var outliers = overTime.filter(f => f.outlier);
                var outlier_circles = svg
                    .selectAll('circle.outlier')
                    .data(outliers)
                    .enter()
                    .append('circle')
                    .attr('class', 'circle outlier')
                    .attr('cx', d => x(d.studyday))
                    .attr('cy', d => y(d.value))
                    .attr('r', '2px')
                    .attr('stroke', color)
                    .attr('fill', color);
            });
    }
}
