export default function checkMeasureDetails() {
    this.measures = d3.set(this.raw_data.map(d => d[this.config.measure_col])).values().sort();
    const missingMeasures = this.config.measure_details
        .map(measure_detail => measure_detail.measure)
        .filter(measure => this.measures.indexOf(measure) < 0);
    if (missingMeasures.length)
        alert(`The data are missing ${missingMeasures.length === 1 ? 'this measure' : 'these measures'}: ${missingMeasures.join(', ')}.`);
}
