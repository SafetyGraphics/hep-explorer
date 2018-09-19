export default function onLayout() {
    var spaghetti = this;
    var eDish = this.parent;

    //customize the display control
    const displayControlWrap = spaghetti.controls.wrap
        .selectAll('div')
        .filter(controlInput => controlInput.label === 'Y-axis Display Type');

    const displayControl = displayControlWrap.select('select');

    //set the start value
    var start_value = eDish.config.display_options.find(f => f.value == eDish.config.display).label;

    displayControl
        .selectAll('option')
        .attr('selected', d => (d == start_value ? 'selected' : null));

    displayControl.on('change', function(d) {
        var currentLabel = this.value;
        var currentValue = eDish.config.display_options.find(f => f.label == currentLabel).value;
        spaghetti.config.y.column = currentValue;
        spaghetti.draw();
    });
}
