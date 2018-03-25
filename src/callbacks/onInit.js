import { flattenData } from './util/flattenData';

export default function onInit() {
    this.raw_data.forEach(function(d) {
        d.NONE = 'All Participants'; // placeholder variable for non-grouped comparisons
    });

    this.raw_data = flattenData.call(this);
}
