export default function calculateRatios(d, participant_obj) {
    this.config.measure_details.forEach(d => {
        this.config.measure_details.filter(di => di.measure !== d.measure).forEach(di => {
            participant_obj[`${d.label}_relative_uln/${di.label}_relative_uln`] = participant_obj[`${d.label}_relative_uln`] / participant_obj[`${di.label}_relative_uln`];
        });
    });
}
