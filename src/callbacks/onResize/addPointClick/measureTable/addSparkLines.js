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
                        .text(''),
                    width = 100,
                    height = 25,
                    offset = 4,
                    overTime = row_d.spark_data.sort((a, b) => +a.visitn - +b.visitn);
                var x = d3.scale
                    .ordinal()
                    .domain(overTime.map(m => m.visitn))
                    .rangePoints([offset, width - offset]);
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
                    return { visitn: m.visitn, value: m.uln };
                });
                var lower = overTime
                    .map(function(m) {
                        return { visitn: m.visitn, value: m.lln };
                    })
                    .reverse();
                var normal_data = d3.merge([upper, lower]);
                var drawnormal = d3.svg
                    .line()
                    .x(d => x(d.visitn))
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
                svg
                    .selectAll('lines.guidelines')
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
                    .x(d => x(d.visitn))
                    .y(d => y(d.value));
                var sparkline = svg
                    .append('path')
                    .datum(overTime)
                    .attr({
                        class: 'sparkLine',
                        d: draw_sparkline,
                        fill: 'none',
                        stroke: '#999'
                    });

                /*
                draw_lln = d3.svg
                    .line()
                    .interpolate('cardinal')
                    .x(d => x(d.visitn))
                    .y(d => y(d.lln)),
                lln = svg
                    .append('path')
                    .datum(overTime)
                    .attr({
                        class: 'sparkLine',
                        d: draw_lln,
                        fill: 'none',
                        stroke: 'green'
                    }),
                */
                //draw min and max points
                var minimumData = overTime.filter(
                    di => di.value === d3.min(overTime.map(dii => dii.value))
                )[0];
                var minimumMonth = svg.append('circle').attr({
                    class: 'circle minimum',
                    cx: x(minimumData.visitn),
                    cy: y(minimumData.value),
                    r: '2px',
                    stroke: 'blue',
                    fill: 'none'
                });
                var maximumData = overTime.filter(
                    di => di.value === d3.max(overTime.map(dii => dii.value))
                )[0];
                var maximumMonth = svg.append('circle').attr({
                    class: 'circle maximum',
                    cx: x(maximumData.visitn),
                    cy: y(maximumData.value),
                    r: '2px',
                    stroke: 'orange',
                    fill: 'none'
                });
            });
    }
}
