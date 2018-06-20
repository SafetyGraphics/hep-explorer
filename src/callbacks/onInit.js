export default function onInit() {
    this.raw_data.forEach(d => {
        d.NONE = 'All Participants'; // placeholder variable for non-grouped comparisons
        d[this.config.value_col] = d[this.config.value_col].replace(/\s/g, ''); // remove space characters
    });
}
