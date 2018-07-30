export default function addRRatioFilter() {
    this.filters.push({
        col: 'rRatioFlag',
        val: 'Y',
        choices: ['Y', 'N'],
        loose: undefined
    });
}
