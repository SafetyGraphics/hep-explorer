export default function iterateOverData() {
    this.raw_data.forEach(d => {
        d.NONE = 'All Participants'; // placeholder variable for non-grouped comparisons
        if (typeof d[this.config.value_col] == 'string') {
            d[this.config.value_col] = d[this.config.value_col].replace(/\s/g, ''); // remove space characters
        }
    });
}
