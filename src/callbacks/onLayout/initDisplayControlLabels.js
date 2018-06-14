export function initDisplayControlLabels() {
    var chart = this;
    var config = this.config;

    const displayControl = this.controls.wrap
        .selectAll('div')
        .filter(controlInput => controlInput.label === 'Display Type')
        .select('select');

    //set the start value
    var start_value = config.axis_options.find(f => f.value == config.display).label;
    displayControl
        .selectAll('option')
        .attr('selected', d => (d == start_value ? 'selected' : null));

    displayControl.on('change', function(d) {
        var currentLabel = this.value;
        var currentValue = config.axis_options.find(f => f.label == currentLabel).value;
        config.display = currentValue;
        config.quadrants.cut_data.displayChange = currentValue;

        chart.draw();
    });
}
