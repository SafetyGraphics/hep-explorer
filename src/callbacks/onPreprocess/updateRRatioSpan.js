export default function updateRRatioSpan() {
    this.controls.wrap
        .select('#r-ratio')
        .text(
            `${
                this.config.x.measure_detail.label
            }xULN / ${
                this.config.y.measure_detail.label
            }xULN`
        );
}
