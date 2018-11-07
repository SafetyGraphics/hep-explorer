export function initDisplayControl() {
    var chart = this;
    var config = this.config;
    const displayControlWrap = this.controls.wrap
        .selectAll('div')
        .filter(controlInput => controlInput.label === 'Display Type');

    const displayControl = displayControlWrap.select('select');

    //set the start value
    var start_value = config.display_options.find(f => f.value == config.display).label;
    displayControl
        .selectAll('option')
        .attr('selected', d => (d == start_value ? 'selected' : null));

    //annotation of baseline visit (only visible when mDish is selected)
    displayControlWrap
        .append('span')
        .attr('class', 'displayControlAnnotation span-description')
        .style('color', 'blue')
        .text(
            'Note: Baseline defined as ' +
                chart.config.baseline.value_col +
                ' = ' +
                chart.config.baseline.values.join(',')
        )
        .style('display', config.display == 'relative_baseline' ? null : 'none');

    displayControl.on('change', function(d) {
        var currentLabel = this.value;
        var currentValue = config.display_options.find(f => f.label == currentLabel).value;
        config.display = currentValue;

        if (currentValue == 'relative_baseline') {
            displayControlWrap.select('span.displayControlAnnotation').style('display', null);
        } else {
            displayControlWrap.select('span.displayControlAnnotation').style('display', 'none');
        }

        config.cuts.display_change = true;

        chart.draw();
    });
}
