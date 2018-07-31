export default function addVisitLevelData() {
    if (this.config.visit_level_points) {
        //Filter raw data on relevant measures and nest by participant and visit.
        const currentMeasureDetails = this.config.measure_details
            .filter(measure_detail => (
                [this.config.x.column, this.config.y.column]
                    .indexOf(measure_detail.label) > -1
                || measure_detail.axis === 'z'
            ));
        const currentMeasures = currentMeasureDetails
            .map(measureDetail => measureDetail.measure);
        const currentMeasureLabels = currentMeasureDetails
            .map(measureDetail => measureDetail.label);
        const visitLevelData = d3.nest()
            .key(d => `${d[this.config.id_col]}||${d[this.config.visit_col]}||${this.varList.map(variable => d[variable]).join('||')}`)
            .rollup(d => {
                const visit_obj = {};
                d.forEach(di => {
                    visit_obj[
                        `${currentMeasureLabels[
                            currentMeasures
                                .findIndex(measure => measure === di[this.config.measure_col])
                        ]}`
                    ] = this.config.display === 'relative_uln'
                        ? di[this.config.value_col] / di[this.config.normal_col_high]
                        : this.config.display === 'relative_baseline'
                            ? di[this.config.value_col]
                              / d.find(dii => dii[this.config.visitn_col] === this.config.baseline_visitn)
                                [this.config.value_col]
                            : this.config.display === 'absolute'
                                ? di[this.config.value_col]
                                : null;
                });
                return visit_obj;
            })
            .entries(
                this.imputed_data
                    .filter(d => currentMeasures.indexOf(d[this.config.measure_col]) > -1)
            );

        //Flatten nested data.
        visitLevelData.forEach(d => {
            //Parse nest key.
            const keys = d.key.split('||');
            d[this.config.id_col] = keys[0];
            d[this.config.visit_col] = keys[1];
            this.varList.forEach((variable,i) => {
                d[variable] = keys[i + 2];
            });
            delete d.key;

            //Un-nest nest values.
            Object.assign(d, d.values);
            d.rRatio = d[this.config.x.column] / d[this.config.measure_details.find(measure_detail => measure_detail.axis === 'z').label];
            d.rRatioFlag = d.rRatio > this.config.r_ratio ? 'Y' : 'N';
            delete d.values;

            //Assign data level.
            d.level = 'visit';
        });

        this.raw_data = this.raw_data
            .concat(visitLevelData);
    }
}
