import safetyedish from '../../wrapper';

export function initResetButton() {
    var chart = this;

    this.controls.reset = {};
    var reset = this.controls.reset;
    reset.wrap = this.controls.wrap.append('div').attr('class', 'control-group');
    reset.label = reset.wrap
        .append('span')
        .attr('class', 'wc-control-label')
        .text('Reset Chart');
    reset.button = reset.wrap
        .append('button')
        .text('Reset')
        .on('click', function() {
            var initial_container = chart.element;
            var initial_settings = chart.initial_settings;
            var initial_data = chart.initial_data;

            chart.destroy();
            chart = null;

            var newChart = safetyedish(initial_container, initial_settings);
            newChart.init(initial_data);
        });
}
