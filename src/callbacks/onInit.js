export default function onInit() {
    this.raw_data.forEach(function(d) {
        d.NONE = 'All Participants'; // placeholder variable for non-grouped comparisons
    });
}
