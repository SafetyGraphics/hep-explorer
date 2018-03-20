import { extent } from 'd3';

export function setDomain(dimension) {
    var domain = this[dimension].domain();
    var cut = this.config.measure_details.find(
        f => this.config[dimension].column.search(f.label) > -1
    ).cut[this.config.display];

    if (cut * 1.01 >= domain[1]) {
        domain[1] = cut * 1.01;
    }

    this[dimension + '_dom'] = domain;
}
