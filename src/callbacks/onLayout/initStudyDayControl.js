import { extent } from 'd3';
import startTransition from './initStudyDayControl/startTransition';
import stopTransition from './initStudyDayControl/stopTransition';

export default function initStudyDayControl() {
    var chart = this;
    var config = this.config;
    const studyDayControlWrap = this.controls.wrap
        .selectAll('div')
        .filter(controlInput => controlInput.label === 'Study Day');

    chart.controls.studyDayInput = studyDayControlWrap.select('input');

    //convert control to a slider
    chart.controls.studyDayInput.attr('type', 'range');

    //set min and max values and add annotations
    chart.controls.studyDayRange = extent(chart.imputed_data, d => d[config.studyday_col]);
    chart.controls.studyDayInput.attr('min', chart.controls.studyDayRange[0]);
    chart.controls.studyDayInput.attr('max', chart.controls.studyDayRange[1]);
    chart.controls.studyDayInput.attr('step', 7);

    studyDayControlWrap
        .insert('span', 'input')
        .attr('class', 'span-description')
        .style('display', 'inline-block')
        .style('padding-right', '0.2em')
        .text(chart.controls.studyDayRange[0]);
    studyDayControlWrap
        .append('span')
        .attr('class', 'span-description')
        .style('display', 'inline-block')
        .style('padding-left', '0.2em')
        .text(chart.controls.studyDayRange[1]);

    //initialize plot_day to day 0 or the min value, whichever is greater
    if (config.plot_day === null) {
        config.plot_day = chart.controls.studyDayRange[0] > 0 ? chart.controls.studyDayRange[0] : 0;
        chart.controls.studyDayInput.node().value = config.plot_day;
    }

    /*
    function showNextStudyDay() {
        if (config.plot_day < chart.studyDayRange[1]) {
            config.plot_day = config.plot_day + 7;
            studyDayInput.node().value = config.plot_day;
            chart.draw();
        } else {
            config.plot_day = chart.studyDayRange[1];
            studyDayInput.node().value = config.plot_day;
            chart.draw();
            chart.moving = false;
            clearInterval(chart.timer);
            studyDayControlWrap.select('button').html('&#9658;');
        }
    }
    */

    //add a play button
    chart.moving = false;
    studyDayControlWrap
        .append('button')
        .html('&#9658;') //play symbol
        .style('padding', '0.2em 0.5em 0.2em 0.5em')
        .style('margin-left', '0.5em')
        .style('border-radius', '0.4em')
        .on('click', function(d) {
            console.log('Gap Minding!');
            console.log(chart);
            var button = d3.select(this);
            if (button.html() == '&#9632;') {
                //stop button
                stopTransition.call(chart);
                button.html = '&#9658;';
            } else {
                //play button
                startTransition.call(chart);
                button.html = '&#9632;';
            }
        });
}
