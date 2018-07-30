export default function calculateRatios(d, participant_obj) {
    this.config.measure_details.forEach(d => {
        this.config.measure_details.filter(di => di.measure !== d.measure).forEach(di => {
            participant_obj[`${d.label}_relative_uln/${di.label}_relative_uln`] = participant_obj[`${d.label}_relative_uln`] / participant_obj[`${di.label}_relative_uln`];
        });
    });

    //R-ratio should be the ratio of ALT to ALP, i.e. the x-axis to the z-axis.
    participant_obj.rRatio = participant_obj[
        `${this.config.measure_details
            .find(measure_detail => measure_detail.axis === 'x')
            .label
        }_relative_uln/${this.config.measure_details
            .find(measure_detail => measure_detail.axis === 'z' )
            .label
        }_relative_uln`
    ];
}
