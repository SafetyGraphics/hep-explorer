export default function updateStudyDayControl() {
    var config = this.config;
    const studyDayControlWrap = this.controls.wrap
        .selectAll('div')
        .filter(controlInput => controlInput.label === 'Study Day');

    // hide study day control if viewing max values
    studyDayControlWrap.style('display', config.plot_max_values ? 'none' : null);

    //update the study day control label with the currently selected values
    const currentValue = studyDayControlWrap.select('input').property('value');
    studyDayControlWrap
        .select('span.span-description')
        .html('Showing data from: <strong>Day ' + currentValue + '</strong>')
        .select('strong')
        .style('color', 'blue');
}
