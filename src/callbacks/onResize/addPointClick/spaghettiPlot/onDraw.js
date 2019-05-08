import { drawMeasureTable } from '../measureTable/drawMeasureTable';

export default function onDraw() {
    var spaghetti = this;
    var eDish = this.edish;

    //make sure x-domain includes the extent of the exposure data
    if (this.edish.exposure.include) {
        this.exposure_data = this.edish.exposure.data.filter(
            d => d[this.edish.config.id_col] === this.edish.clicked_id
        );
        const extent = [
            d3.min(this.exposure_data, d => +d[this.edish.config.exposure_stdy_col]),
            d3.max(this.exposure_data, d => +d[this.edish.config.exposure_endy_col])
        ];
        if (extent[0] < this.x_dom[0]) this.x_dom[0] = extent[0];
        if (extent[1] > this.x_dom[1]) this.x_dom[1] = extent[1];
    }

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
