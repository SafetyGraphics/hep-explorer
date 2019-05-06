export default function addExposure() {
    this.svg.select('.se-exposure-group').remove();
    if (this.edish.exposure.include) {
        const exposures = this.edish.exposure.data.filter(
            d => d[this.edish.config.id_col] === this.edish.clicked_id
        );
        const g = this.svg.insert('g', '.supergroup').classed('se-exposure-group', true);
        const rects = g
            .selectAll('rect.se-exposure')
            .data(exposures)
            .enter()
            .append('rect')
            .classed('se-exposure', true)
            .attr({
                x: d => this.x(+d.EXSTDY),
                y: 0,
                width: d =>
                    d.EXSTDY !== d.EXENDY ? this.x(+d.EXENDY) - this.x(+d.EXSTDY) : 1, // for single day exposures
                height: this.plot_height,
                fill: 'black',
                'fill-opacity': 0.1
            });
        const titles = rects
            .append('title')
            .text(
                d =>
                    `Study Day: ${d.EXSTDY}-${d.EXENDY} (${+d.EXENDY -
                        +d.EXSTDY +
                        (+d.EXENDY >= +d.EXSTDY)} days)\nExposure: ${d.EXTRT}`
            );
    }
}
