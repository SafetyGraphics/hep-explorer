export default function startTransition() {
    var chart = this;
    var config = this.config;
    console.log('Transition Starting');

    function reposition(point) {
        point
            .attr('cx', function(d) {
                return chart.x(d[config.x.column]);
            })
            .attr('cy', function(d) {
                return chart.x(d[config.y.column]);
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
        console.log('Drawing: day ' + currentDay);
        //update the controls
        config.plot_day = currentDay;
        chart.controls.studyDayInput.node().value = config.plot_day;
        //TODO: update the label

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
        console.log(min + '-' + max);
        var studyday = d3.interpolateNumber(min, max);

        return function(t) {
            showDay(studyday(t));
        };
    }

    chart.myTransition = chart.svg
        .transition()
        .duration(30000)
        .ease('linear')
        .tween('studyday', tweenStudyDay);
    //  .each('end', chart.draw());
}
