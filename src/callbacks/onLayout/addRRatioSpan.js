export default function addRRatioSpan() {
    const rRatioLabel = this.controls.wrap
        .selectAll('.control-group')
        .filter(d => d.option === 'r_ratio')
        .select('.wc-control-label');
    rRatioLabel.html(`${rRatioLabel.html()} (<span id = 'r-ratio'></span>)`);
}
