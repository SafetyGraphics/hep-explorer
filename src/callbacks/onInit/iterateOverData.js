export default function iterateOverData() {
    this.raw_data.forEach(d => {
        d[this.config.x.column] = null; // placeholder variable for x-axis
        d[this.config.y.column] = null; // placeholder variable for y-axis
        d.NONE = 'All Participants'; // placeholder variable for non-grouped comparisons

        //Remove space characters from result variable.
        if (typeof d[this.config.value_col] == 'string')
            d[this.config.value_col] = d[this.config.value_col].replace(/\s/g, ''); // remove space characters
    });
}
