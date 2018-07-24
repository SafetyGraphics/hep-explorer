export function initTitle() {
    if (this.config.showTitle) {
        this.titleDiv = this.controls.wrap
            .insert('div', '*')
            .attr('class', 'title')
            .style('border-top', '1px solid black')
            .style('border-bottom', '1px solid black')
            .style('margin-right', '1em')
            .style('margin-bottom', '1em');

        this.titleDiv
            .append('span')
            .text('Safety eDish')
            .style('font-size', '1.5em')
            .style('font-weight', 'strong')
            .style('display', 'block');

        this.titleDiv
            .append('span')
            .text('Use controls to update chart or click a point to see participant details.')
            .style('font-size', '0.8em');
    }
}
