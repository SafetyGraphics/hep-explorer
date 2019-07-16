import stopAnimation from './initStudyDayControl/stopAnimation';

export default function customizePlotStyleToggle() {
    const chart = this;
    this.controls.wrap
        .selectAll('.control-group')
        .filter(d => d.option === 'plot_max_values')
        .selectAll('input')
        .on('change', function(d) {
            chart.config.plot_max_values = d;
            stopAnimation.call(chart);
        });
}
