export default function updateRRatioSpan() {
    this.controls.wrap
        .select('#r-ratio')
        .text(
            `${
                this.config.measure_details.find(measure_detail => measure_detail.axis === 'x')
                    .label
            }xULN / ${
                this.config.measure_details.find(measure_detail => measure_detail.axis === 'z')
                    .label
            }xULN`
        );
}
