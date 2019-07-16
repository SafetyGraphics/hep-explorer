export default function stopAnimation() {
    var chart = this;
    chart.svg
        .transition()
        .duration(0)
        .each('end', function() {
            chart.draw();
        });
}
