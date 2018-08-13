export default function addVisitLevelData() {
    if (this.config.visit_level_points) {
        //Filter raw data on relevant measures and nest by participant and visit.
        const currentMeasureDetails = this.config.measure_details.filter(
            measure_detail =>
                [this.config.x.column, this.config.y.column].indexOf(measure_detail.label) > -1 ||
                //measure_detail.axis === 'z'
                measure_detail.label === 'ALP'
        );
        const currentMeasures = currentMeasureDetails.map(measureDetail => measureDetail.measure);
        const currentMeasureLabels = currentMeasureDetails.map(
            measureDetail => measureDetail.label
        );
        const visitLevelData = d3
            .nest()
            .key(
                d =>
                    `${d[this.config.id_col]}||${d[this.config.visit_col]}||${this.varList
                        .map(variable => d[variable])
                        .join('||')}`
            )
            .rollup(d => {
                const visit_obj = {};
                d.forEach(di => {
                    //Capture measure label/abbreviation given full measure text.
                    const measureLabel =
                        currentMeasureLabels[
                            currentMeasures.findIndex(
                                measure => measure === di[this.config.measure_col]
                            )
                        ];

                    //Calculate ULN-relative, baseline-relative, or raw result.
                    visit_obj[measureLabel] =
                        this.config.display === 'relative_uln'
                            ? di[this.config.value_col] / di[this.config.normal_col_high]
                            : this.config.display === 'relative_baseline'
                                ? di[this.config.value_col] /
                                  (this.raw_data.find(
                                      dii => dii[this.config.id_col] === di[this.config.id_col]
                                  )[`${measureLabel}_baseline_absolute`] || NaN)
                                : this.config.display === 'absolute'
                                    ? di[this.config.value_col]
                                    : null;
                });
                return visit_obj;
            })
            .entries(
                this.imputed_data.filter(
                    d => currentMeasures.indexOf(d[this.config.measure_col]) > -1
                )
            );

        //Flatten nested data.
        visitLevelData.forEach(d => {
            //Parse nest key.
            const keys = d.key.split('||');
            d[this.config.id_col] = keys[0];
            d[this.config.visit_col] = keys[1];
            this.varList.forEach((variable, i) => {
                d[variable] = keys[i + 2];
            });
            delete d.key;

            //Un-nest nest values.
            Object.assign(d, d.values);
            delete d.values;

            if (
                this.config.r_ratio_filter &&
                this.config.x.column === 'ALT' &&
                this.config.measure_details.some(measure_detail => measure_detail.label === 'ALP')
            ) {
                //R-ratio should be the ratio of ALT to ALP, i.e. the x-axis to the z-axis.
                d.rRatio = d.ALT / d.ALP;
                d.rRatioFlag = d.rRatio > this.config.r_ratio_cut ? 'Y' : 'N';
            }

            //Assign data level.
            d.level = 'visit';
        });

        this.raw_data = this.raw_data.concat(visitLevelData);
    }
}
