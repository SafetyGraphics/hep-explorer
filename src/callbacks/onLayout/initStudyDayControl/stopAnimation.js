export default function stopAnimation() {
    var chart = this;
    chart.svg
        .transition()
        .duration(0)
        .each('end', chart.draw());
}
