export default function updateClipPath() {
    //embiggen clip-path so points aren't clipped
    const radius = this.config.marks.find(mark => mark.type === 'circle').radius;
    this.svg
        .select('.plotting-area')
        .attr('width', this.plot_width + radius * 2 + 2) // plot width + circle radius * 2 + circle stroke width * 2
        .attr('height', this.plot_height + radius * 2 + 2) // plot height + circle radius * 2 + circle stroke width * 2
        .attr(
            'transform',
            `translate(-${
                radius + 1 // translate left circle radius + circle stroke width
            },-${
                radius + 1 // translate up circle radius + circle stroke width
            })`
        );
}
