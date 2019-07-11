export default function startAnimation() {
    var chart = this;
    var config = this.config;
    // calculate animation duration
    const day_count = chart.controls.studyDayRange[1] - config.plot_day;
    const duration = day_count < 300 ? day_count * 100 : 30000;
    const day_duration = duration / day_count;

    function reposition(point) {
        point
            .transition()
            .duration(day_duration)
            .attr('cx', function(d) {
                return chart.x(d[config.x.column]);
            })
            .attr('cy', function(d) {
                return chart.y(d[config.y.column]);
            })
            .attr('r', function(d) {
                return config.point_size == 'Uniform'
                    ? d.mark.radius || config.flex_point_size
                    : chart.sizeScale(d[config.point_size]);
            });
    }

    function updateDatum(d, currentDay) {
        // adds temporary x, y and size (if any) measures for the current day to the core datum (instead of under d.value)
        // these get removed when the transition ends and chart.draw() is called.
        var measures = [config.x.column, config.y.column];
        if (config.point_size != 'Uniform') {
            measures = d3.merge([measures, [config.point_size]]);
        }

        var raw = d.values.raw[0];
        measures.forEach(function(m) {
            var vals = raw[m + '_raw'];
            var getLastMeasureIndex = d3.bisector(d => d.day).left;
            var lastMeasureIndexPlusOne = getLastMeasureIndex(vals, currentDay);
            var lastMeasureIndex = lastMeasureIndexPlusOne - 1;
            d[m] = lastMeasureIndex >= 0 ? vals[lastMeasureIndex]['value'] : null;
        });

        return d;
    }

    function showDay(currentDay) {
        //update the controls
        config.plot_day = currentDay;
        chart.controls.studyDayInput.node().value = config.plot_day;

        //update the label
        chart.controls.studyDayControlWrap
            .select('span.span-description')
            .html('Showing data from: <strong>Day ' + Math.floor(config.plot_day) + '</strong>')
            .select('strong')
            .style('color', 'blue');

        //reposition the points
        var points = chart.marks[0].circles
            .datum(function(d) {
                return updateDatum(d, currentDay);
            })
            .call(reposition);
    }

    function tweenStudyDay() {
        var min = config.plot_day;
        var max = chart.controls.studyDayRange[1];
        var studyday = d3.interpolateNumber(min, max);

        return function(t) {
            showDay(studyday(t));
        };
    }

    //show the stop button
    chart.controls.studyDayPlayButton.datum({ state: 'stop' });
    chart.controls.studyDayPlayButton.html('&#9632;');

    // Initialize the Transition
    chart.myTransition = chart.svg
        .transition()
        .duration(duration)
        .ease('linear')
        .tween('studyday', tweenStudyDay)
        .each('end', function() {
            chart.draw();
        });
}
