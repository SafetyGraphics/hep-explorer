import { drawMeasureTable } from '../measureTable/drawMeasureTable';

export default function onDraw() {
    var spaghetti = this;
    var eDish = this.edish;

    //make sure y domain includes the current cut point for all measures
    const max_value = d3.max(spaghetti.filtered_data, f => f[spaghetti.config.y.column]);
    const max_cut = d3.max(spaghetti.filtered_data, f => f[spaghetti.config.y.column + '_cut']);
    const y_max = d3.max([max_value, max_cut]);
    spaghetti.config.y.domain = [0, y_max];
    spaghetti.y_dom = spaghetti.config.y.domain;

    //initialize the measureTable
    if (spaghetti.config.firstDraw) {
        drawMeasureTable.call(eDish, this.participant_data);
        spaghetti.config.firstDraw = false;
    }
}
