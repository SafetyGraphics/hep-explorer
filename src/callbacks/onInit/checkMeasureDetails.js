export default function checkMeasureDetails() {
    this.measures = d3.set(this.raw_data.map(d => d[this.config.measure_col])).values().sort();
    const specifiedMeasures = this.config.measure_details.map(measure_detail => measure_detail.measure);
    this.config.measure_details = this.config.measure_details
        .filter(measure => this.measures.indexOf(measure) < 0);
    const missingMeasures = specifiedMeasures
        .filter(measure => (
            this.config.measure_details
                .map(measure_detail => measure_detail.measure).indexOf(measure) < 0
        ));
    const nMeasuresRemoved = missingMeasures.length;
    if (nMeasuresRemoved > 0)
        alert(`The data are missing ${nMeasuresRemoved === 1 ? 'this measure' : 'these measures'}: ${missingMeasures.join(', ')}.`);
}
