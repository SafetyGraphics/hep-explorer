export function initFilterLabel() {
    const chart = this;
    const config = this.config;
    //check to see if at least 1 filter exists
    if (config.r_ratio_filter || config.filters.length > 0) {
        //insert a header before the first filter
        const control_wraps = this.controls.wrap.selectAll('div');
        var first_filter = config.r_ratio_filter
            ? control_wraps.filter(controlInput => controlInput.label === 'Minimum R Ratio')
            : control_wraps.filter(controlInput => controlInput.type === 'subsetter');

        this.controls.filter_header = first_filter
            .insert('div', '*')
            .attr('class', 'subtitle')
            .style('border-top', '1px solid black')
            .style('border-bottom', '1px solid black')
            .style('margin-right', '1em')
            .style('margin-bottom', '1em');
        this.controls.filter_header
            .append('span')
            .text('Filters')
            .style('font-size', '1.5em')
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
                    '</span> partiticpants shown.'
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
