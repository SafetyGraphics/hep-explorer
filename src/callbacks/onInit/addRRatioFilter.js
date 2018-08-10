export default function addRRatioFilter() {
    if (this.config.r_ratio_filter) {
        this.filters.push({
            col: 'rRatioFlag',
            val: 'Y',
            choices: ['Y', 'N'],
            loose: undefined
        });
    }
}
