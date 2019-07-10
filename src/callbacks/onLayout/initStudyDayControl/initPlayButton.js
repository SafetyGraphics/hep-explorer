import startTransition from './startTransition';
import stopTransition from './stopTransition';

// &#9658; = play symbol
// &#9632; = stop symbol
// &#8634; = restart symbol

export default function initPlayButton() {
    var chart = this;
    var config = this.config;
    chart.controls.studyDayPlayButton = chart.controls.studyDayControlWrap
        .append('button')
        .datum({ state: 'play' })
        .html('&#9658;') //play symbol
        .style('padding', '0.2em 0.5em 0.2em 0.5em')
        .style('margin-left', '0.5em')
        .style('border-radius', '0.4em')
        //.style('display', 'none')
        .on('click', function(d) {
            console.log('Gap Minding!');
            console.log(chart);
            var button = d3.select(this);
            if (d.state === 'play') {
                console.log('playing transition');
                d.state = 'stop';
                button.html('&#9632;');
                startTransition.call(chart);
            } else if (d.state === 'restart') {
                console.log('restarting transition');

                config.plot_day =
                    chart.controls.studyDayRange[0] > 0 ? chart.controls.studyDayRange[0] : 0;
                chart.controls.studyDayInput.node().value = config.plot_day;
                chart.draw();

                d.state = 'stop';
                button.html('&#9632;');
                startTransition.call(chart);
            } else {
                console.log('stopping transition');

                d.state = 'play';
                button.html('&#9658;');
                stopTransition.call(chart);
            }
        });
}
