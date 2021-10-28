export function setPointSize() {
    const config = this.config;

    // Create the scale.
    const base_size = config.marks[0].radius || config.flex_point_size; // minimum radius
    const max_size = base_size * 5; // maximum radius
    const small_size = base_size / 2; // radius for missing values

    if (config.point_size !== 'Uniform') {
        // Get all values of selected measure.
        const sizeValues_all = d3.merge(
            this.raw_data.map(d => d[config.point_size + '_raw']).filter(d => d !== undefined)
        );

        // Define the domain of the selected measure.
        const sizeDomain =
            config.point_size === 'rRatio'
                ? [0, d3.max(this.raw_data, d => d.rRatio_relative_uln)]
                : config.point_size === 'nrRatio'
                ? [0, d3.max(this.raw_data, d => d.nrRatio_relative_uln)]
                : config.plot_max_values
                ? d3.extent(this.raw_data.map(m => m[config.point_size]))
                : d3.extent(sizeValues_all, f => f.value);

        // Scale the selected domain to the minimum and maximum radius values.
        this.sizeScale = d3.scale
            .linear()
            .domain(sizeDomain)
            .range([base_size, max_size]);
    }

    //TODO: draw a legend (coming later?)

    // Set the point radius.
    this.marks[0].circles
        .transition()
        .attr('r', d => {
            const raw = d.values.raw[0];
            if (raw.outOfRange) {
                return small_size;
            } else if (config.point_size == 'Uniform') {
                return base_size;
            } else {
                return this.sizeScale(raw[config.point_size]);
            }
        })
        .attr('cx', d => this.x(d.values.x))
        .attr('cy', d => this.y(d.values.y));
}
