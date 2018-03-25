export function addSparkLines(d) {
    if (this.data.raw.length > 0) {
        //don't try to draw sparklines if the table is empty
        this.tbody.selectAll('tr').each(function(row_d) {
            //Spark line cell
            const cell = d3
                    .select(this)
                    .select('td.spark')
                    .text(''),
                width = 100,
                height = 25,
                offset = 4,
                overTime = row_d.spark_data.sort((a, b) => +a.visitn - +b.visitn),
                x = d3.scale
                    .ordinal()
                    .domain(overTime.map(m => m.visitn))
                    .rangePoints([offset, width - offset]),
                y = d3.scale
                    .linear()
                    .domain(d3.extent(overTime, d => d.value))
                    .range([height - offset, offset]),
                line = d3.svg
                    .line()
                    .interpolate('cardinal')
                    .x(d => x(d.visitn))
                    .y(d => y(d.value)),
                svg = cell
                    .append('svg')
                    .attr({
                        width: width,
                        height: height
                    })
                    .append('g'),
                sparkLine = svg
                    .append('path')
                    .datum(overTime)
                    .attr({
                        class: 'sparkLine',
                        d: line,
                        fill: 'none',
                        stroke: '#bbb'
                    }),
                minimumData = overTime.filter(
                    di => di.value === d3.min(overTime.map(dii => dii.value))
                )[0],
                minimumMonth = svg.append('circle').attr({
                    class: 'circle minimum',
                    cx: x(minimumData.visitn),
                    cy: y(minimumData.value),
                    r: '2px',
                    stroke: 'blue',
                    fill: 'none'
                }),
                maximumData = overTime.filter(
                    di => di.value === d3.max(overTime.map(dii => dii.value))
                )[0],
                maximumMonth = svg.append('circle').attr({
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
