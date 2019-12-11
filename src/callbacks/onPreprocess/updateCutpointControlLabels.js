export default function updateControlCutpointLabels() {
    const config = this.config;
    if (this.controls.config.inputs.find(input => input.description === 'X-axis Reference Line'))
        this.controls.wrap
            .selectAll('.control-group')
            .filter(d => d.description === 'X-axis Reference Line')
            .select('.wc-control-label')
            .text(`${config.measure_values[config.x.column]} Reference Line`);
    if (this.controls.config.inputs.find(input => input.description === 'Y-axis Reference Line'))
        this.controls.wrap
            .selectAll('.control-group')
            .filter(d => d.description === 'Y-axis Reference Line')
            .select('.wc-control-label')
            .text(`${config.measure_values[config.y.column]} Reference Line`);
}
