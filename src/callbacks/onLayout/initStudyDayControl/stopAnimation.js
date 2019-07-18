export default function stopAnimation() {
    var chart = this;
    chart.svg
        .transition()
        .duration(0)
        .each('end', function() {
            chart.controls.studyDayPlayButton.datum({ state: 'play' });
            chart.controls.studyDayPlayButton.html('&#9658;');
            chart.draw();
        });
}
