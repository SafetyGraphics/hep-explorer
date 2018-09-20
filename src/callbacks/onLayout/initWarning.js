export function initWarning() {
    if (this.config.warningText) {
        this.warningDiv = this.controls.messages.wrap
            .append('div')
            .attr('class', 'caution')
            .style('border', '1px solid #faebcc')
            .style('border-radius', '0.2em')
            .style('margin-right', '1em')
            .style('margin-bottom', '1em')
            .style('padding', '0.4em')
            .style('color', '#8a6d3b')
            .style('background-color', '#fcf8e3')
            .text(this.config.warningText);
    }
}
