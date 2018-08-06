export default function calculateRRatios(d, participant_obj) {
    if (this.config.r_ratio_filter) {
        //R-ratio should be the ratio of ALT to ALP, i.e. the x-axis to the z-axis.
        participant_obj.rRatio =
            participant_obj['ALT_relative_uln'] / participant_obj['ALP_relative_uln'];

        //Define flag given r-ratio minimum.
        participant_obj.rRatioFlag = participant_obj.rRatio > this.config.r_ratio_cut ? 'Y' : 'N';
    }
}
