export default function startAnimation() {
    var chart = this;
    var config = this.config;
    // calculate animation duration
    const day_count = chart.controls.studyDayRange[1] - config.plot_day;
    const duration = day_count < 300 ? day_count * 100 : 30000;
    const day_duration = duration / day_count;

    const base_size = config.marks[0].radius || config.flex_point_size;
    const small_size = base_size / 2;

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
                if (d.outOfRange) {
                    return small_size;
                } else if (config.point_size == 'Uniform') {
                    return base_size;
                } else {
                    return chart.sizeScale(d[config.point_size]);
                }
            })
            .attr('fill-opacity', function(d) {
                return config.plot_day < d.day_range[0] ? 0 : 1;
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
        d.outOfRange = false;
        d.day_range = raw.day_range;
        measures.forEach(function(m) {
            var vals = raw[m + '_raw'];

            // Did currentDay occur while participant was enrolled?
            if (vals.length) {
                var first = vals[0];
                var last = vals[vals.length - 1];
                var before = currentDay < first.day;
                var after = currentDay > last.day;
                d.outOfRange = d.outOfRange || before || after;
            }

            //Get the most recent data point (or the first point if participant isn't enrolled yet)
            var getLastMeasureIndex = d3.bisector(d => d.day).left;
            var lastMeasureIndexPlusOne = getLastMeasureIndex(vals, currentDay);
            var lastMeasureIndex = lastMeasureIndexPlusOne - 1;
            d[m] =
                lastMeasureIndex >= 0
                    ? vals[lastMeasureIndex]['value']
                    : vals.length
                    ? vals[0].value
                    : null;
        });
        return d;
    }

    function showDay(currentDay) {
        //update the controls
        config.plot_day = Math.floor(currentDay);
        chart.controls.studyDayInput.node().value = config.plot_day;

        //update the label
        chart.controls.studyDayControlWrap
            .select('span.span-description')
            .html('Showing data from: <strong>Day ' + config.plot_day + '</strong>')
            .select('strong')
            .style('color', 'blue');

        //reposition the points
        var points = chart.marks[0].circles
            .datum(function(d) {
                return updateDatum(d, config.plot_day);
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
