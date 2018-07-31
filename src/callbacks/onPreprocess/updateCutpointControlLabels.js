export default function updateControlCutpointLabels() {
    if (this.controls.config.inputs.find(input => input.option === 'quadrants.cut_data.x'))
        this.controls.wrap
            .selectAll('.control-group')
            .filter(d => d.option === 'quadrants.cut_data.x')
            .select('.wc-control-label')
            .text(`${this.config.x.column} Cutpoint`);
    if (this.controls.config.inputs.find(input => input.option === 'quadrants.cut_data.y'))
        this.controls.wrap
            .selectAll('.control-group')
            .filter(d => d.option === 'quadrants.cut_data.y')
            .select('.wc-control-label')
            .text(`${this.config.y.column} Cutpoint`);
}
