export default function updateStudyDayControl() {
    var chart = this;
    var config = this.config;

    // cancel the animation (if any is running)
    var activeAnimation = chart.controls.studyDayPlayButton.datum().state == 'stop';
    if (activeAnimation) {
        chart.svg.transition().duration(0);
    }

    // hide study day control if viewing max values
    chart.controls.studyDayControlWrap.style('display', config.plot_max_values ? 'none' : null);

    //set the status of the play button
    if (config.plot_day >= chart.controls.studyDayRange[1]) {
        chart.controls.studyDayPlayButton.datum({ state: 'restart' });
        chart.controls.studyDayPlayButton.html('&#8634;');
    } else {
        chart.controls.studyDayPlayButton.datum({ state: 'play' });
        chart.controls.studyDayPlayButton.html('&#9658;');
    }

    //update the study day control label with the currently selected values
    const currentValue = chart.controls.studyDayControlWrap.select('input').property('value');
    chart.controls.studyDayControlWrap
        .select('span.span-description')
        .html('Showing data from: <strong>Day ' + currentValue + '</strong>')
        .select('strong')
        .style('color', 'blue');
}
