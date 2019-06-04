export function formatRRatioControl() {
    var chart = this;
    var config = this.config;
    if (this.config.r_ratio_filter) {
        const min_r_ratio = this.controls.wrap
            .selectAll('.control-group')
            .filter(d => d.option === 'r_ratio[0]');
        const min_r_ratio_input = min_r_ratio.select('input');

        const max_r_ratio = this.controls.wrap
            .selectAll('.control-group')
            .filter(d => d.option === 'r_ratio[1]');
        const max_r_ratio_input = max_r_ratio.select('input');

        min_r_ratio_input.attr('id', 'r_ratio_min');
        max_r_ratio_input.attr('id', 'r_ratio_max');

        //move the max r ratio control next to the min control
        min_r_ratio.append('span').text(' - ');
        min_r_ratio.append(function() {
            return max_r_ratio_input.node();
        });

        max_r_ratio.remove();

        //add a reset button
        min_r_ratio
            .append('button')
            .style('padding', '0.2em 0.5em 0.2em 0.4em')
            .style('margin-left', '0.5em')
            .style('border-radius', '0.4em')
            .text('Reset')
            .on('click', function() {
                config.r_ratio[0] = 0;
                min_r_ratio.select('input#r_ratio_min').property('value', config.r_ratio[0]);
                config.r_ratio[1] = config.max_r_ratio;
                min_r_ratio.select('input#r_ratio_max').property('value', config.r_ratio[1]);
                chart.draw();
            });
    }
}
