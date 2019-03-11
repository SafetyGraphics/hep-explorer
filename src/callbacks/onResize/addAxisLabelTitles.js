export function addAxisLabelTitles() {
    var chart = this;
    var config = this.config;

    const details =
        config.display == 'relative_uln'
            ? 'Values are plotted as multiples of the upper limit of normal for the measure.'
            : config.display == 'relative_baseline'
            ? "Values are plotted as multiples of the partipant's baseline value for the measure."
            : config.display == 'absolute'
            ? ' Values are plotted using the raw units for the measure.'
            : null;

    var axisLabels = chart.svg
        .selectAll('.axis')
        .select('.axis-title')
        .select('tspan')
        .remove();

    var axisLabels = chart.svg
        .selectAll('.axis')
        .select('.axis-title')
        .append('tspan')
        .html(function(d) {
            //var current = d3.select(this).text();
            return ' &#9432;';
        })
        .attr('font-size', '0.8em')
        .style('cursor', 'help')
        .append('title')
        .text(details);
}
