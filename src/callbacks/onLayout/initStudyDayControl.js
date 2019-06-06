import { extent } from 'd3';

export default function initStudyDayControl() {
    var chart = this;
    var config = this.config;
    const studyDayControlWrap = this.controls.wrap
        .selectAll('div')
        .filter(controlInput => controlInput.label === 'Study Day');

    const studyDayInput = studyDayControlWrap.select('input');

    //convert control to a slider
    studyDayInput.attr('type', 'range');

    //set min and max values and add annotations
    const studyDayRange = extent(chart.imputed_data, d => d[config.studyday_col]);
    studyDayInput.attr('min', studyDayRange[0]);
    studyDayInput.attr('max', studyDayRange[1]);

    studyDayControlWrap
        .insert('span', 'input')
        .attr('class', 'span-description')
        .style('display', 'inline-block')
        .style('padding-right', '0.2em')
        .text(studyDayRange[0]);
    studyDayControlWrap
        .append('span')
        .attr('class', 'span-description')
        .style('display', 'inline-block')
        .style('padding-left', '0.2em')
        .text(studyDayRange[1]);

    //initialize plot_day to day 0 or the min value, whichever is greater
    if (config.plot_day === null) {
        config.plot_day = studyDayRange[0] > 0 ? studyDayRange[0] : 0;
        studyDayInput.attr('value', config.plot_day);
    }

    //redraw the chart when the studyDay changes
    //studyDayInput.on('change', function() {
    //    console.log('drawing with new study day');
    //    chart.draw();
    //});

    //add a play button
    studyDayControlWrap
        .append('button')
        .html('&#9658;')
        .style('padding', '0.2em 0.5em 0.2em 0.5em')
        .style('margin-left', '0.5em')
        .style('border-radius', '0.4em')
        .on('click', function(d) {
            console.log('Gap Minding!');
        });
}
