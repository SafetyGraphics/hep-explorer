export function relabelMeasureControls() {
    var chart = this;
    var config = this.config;
    const all_settings = ['x_options', 'y_options', 'point_size_options'];
    const controlLabels = ['X-axis Measure', 'Y-axis Measure', 'Point Size'];
    const controlWraps = chart.controls.wrap
        .selectAll('div')
        .filter(controlInput => controlLabels.indexOf(controlInput.label) > -1);
    const controls = controlWraps.select('select');
    const options = controls.selectAll('option');
    var allKeys = Object.keys(config.measure_values);
    options
        .text(d => (allKeys.indexOf(d) > -1 ? config.measure_values[d] : d))
        .property('value', d => d);
}
