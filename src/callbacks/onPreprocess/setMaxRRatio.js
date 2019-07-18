export default function setMaxRRatio() {
    var chart = this;
    var config = this.config;
    var r_ratio_wrap = chart.controls.wrap
        .selectAll('.control-group')
        .filter(d => d.option === 'r_ratio[0]');

    //if no max value is defined, use the max value from the data
    if (this.config.r_ratio_filter) {
        if (!config.r_ratio[1]) {
            let raw_max_r_ratio = d3.max(this.raw_data, d => d.rRatio_max);
            config.max_r_ratio = Math.ceil(raw_max_r_ratio * 10) / 10; //round up to the nearest 0.1
            config.r_ratio[1] = config.max_r_ratio;
            chart.controls.wrap
                .selectAll('.control-group')
                .filter(d => d.option === 'r_ratio[0]')
                .select('input#r_ratio_max')
                .property('value', config.max_r_ratio);
        }

        //make sure r_ratio[0] <= r_ratio[1]
        if (config.r_ratio[0] > config.r_ratio[1]) {
            config.r_ratio = config.r_ratio.reverse();
            r_ratio_wrap.select('input#r_ratio_min').property('value', config.r_ratio[0]);
            r_ratio_wrap.select('input#r_ratio_max').property('value', config.r_ratio[1]);
        }

        //Define flag given r-ratio minimum.
        this.raw_data.forEach(function(participant_obj) {
            const aboveMin = participant_obj.rRatio >= config.r_ratio[0];
            const belowMax = participant_obj.rRatio <= config.r_ratio[1];
            participant_obj.rRatioFlag = aboveMin & belowMax ? 'Y' : 'N';
        });
    }
}
