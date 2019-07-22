export function setPointSize() {
    var chart = this;
    var config = this.config;
    var points = this.marks[0].circles;

    //create the scale
    const base_size = config.marks[0].radius || config.flex_point_size;
    const max_size = base_size * 5;
    const small_size = base_size / 2;

    if (config.point_size != 'Uniform') {
        var sizeValues_all = d3.merge(chart.raw_data.map(m => m[config.point_size + '_raw']));
        var sizeDomain_all = d3.extent(sizeValues_all, f => f.value);
        var sizeDomain_max = d3.extent(chart.raw_data.map(m => m[config.point_size]));
        var sizeDomain = config.plot_max_values ? sizeDomain_max : sizeDomain_all;

        chart.sizeScale = d3.scale
            .linear()
            .range([base_size, max_size])
            .domain(sizeDomain);
    }

    //TODO: draw a legend (coming later?)

    //set the point radius
    points
        .transition()
        .attr('r', function(d) {
            var raw = d.values.raw[0];
            if (raw.outOfRange) {
                return small_size;
            } else if (config.point_size == 'Uniform') {
                return base_size;
            } else {
                return chart.sizeScale(raw[config.point_size]);
            }
        })
        .attr('cx', d => this.x(d.values.x))
        .attr('cy', d => this.y(d.values.y));
}
