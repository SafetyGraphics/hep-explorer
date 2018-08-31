export default function updateRRatioSpan() {
    if (this.config.r_ratio_filter) {
        this.controls.wrap.select('#r-ratio').text('(ALT/ULN) / (ALP/ULN)');
    }
}
