export function initControlLabels() {
    const chart = this;
    const config = this.config;

    //Add settings label
    const first_setting = this.controls.wrap
        .selectAll('div.control-group')
        .filter(f => f.type != 'subsetter')
        .filter(f => f.option != 'r_ratio[0]')
        .filter((f, i) => i == 0)
        .attr('class', 'first-setting');

    this.controls.setting_header = this.controls.wrap
        .insert('div', '.first-setting')
        .attr('class', 'subtitle')
        .style('border-top', '1px solid black')
        .style('border-bottom', '1px solid black')
        .style('margin-right', '1em')
        .style('margin-bottom', '1em');

    this.controls.setting_header
        .append('span')
        .text('Settings')
        .style('font-weight', 'strong')
        .style('display', 'block');

    //Add filter label if at least 1 filter exists
    if (config.r_ratio_filter || config.filters.length > 0) {
        //insert a header before the first filter
        const control_wraps = this.controls.wrap
            .selectAll('div')
            .filter(
                controlInput =>
                    controlInput.label === 'R Ratio Range' || controlInput.type === 'subsetter'
            )
            .classed('subsetter', true);

        this.controls.filter_header = this.controls.wrap
            .insert('div', 'div.subsetter')
            .attr('class', 'subtitle')
            .style('border-top', '1px solid black')
            .style('border-bottom', '1px solid black')
            .style('margin-right', '1em')
            .style('margin-bottom', '1em');
        this.controls.filter_header
            .append('span')
            .text('Filters')
            .style('font-weight', 'strong')
            .style('display', 'block');
        const population = d3.set(this.initial_data.map(m => m[config.id_col])).values().length;
        this.controls.filter_header
            .append('span')
            .attr('class', 'popCount')
            .html(
                '<span class="numerator">' +
                    population +
                    '</span> of <span class="denominator">' +
                    population +
                    '</span> participants shown.'
            )
            .style('font-size', '0.8em');

        this.controls.filter_numerator = this.controls.filter_header
            .select('span.popCount')
            .select('span.numerator');
        this.controls.filter_denominator = this.controls.filter_header
            .select('span.popCount')
            .select('span.denominator');
    }
}
