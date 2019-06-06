export function setDomain(d) {
    //y-domain includes 99th population percentile + any participant outliers
    const raw_values = this.raw_data.map(m => m.value);
    const population_extent = this.raw_data[0].population_extent;
    var y_min = d3.min(d3.merge([raw_values, population_extent])) * 0.99;
    var y_max = d3.max(d3.merge([raw_values, population_extent])) * 1.01;
    this.y.domain([y_min, y_max]);
    this.y_dom = [y_min, y_max];
}
