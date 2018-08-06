export default function addRRatioSpan() {
    if (this.config.r_ratio_filter) {
        const rRatioLabel = this.controls.wrap
            .selectAll('.control-group')
            .filter(d => d.option === 'r_ratio_cut')
            .select('.wc-control-label');
        rRatioLabel.html(`${rRatioLabel.html()} (<span id = 'r-ratio'></span>)`);
    }
}
