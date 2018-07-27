export function dragged() {
    var chart = d3.select(this).datum().chart;

    var x = d3.event.dx;
    var y = d3.event.dy;

    var line = d3.select(this).select('line.cut-line');
    var lineBack = d3.select(this).select('line.cut-line-backing');

    var dimension = d3.select(this).classed('x') ? 'x' : 'y';

    // Update the line properties
    var attributes = {
        x1: Math.max(0, parseInt(line.attr('x1')) + (dimension == 'x' ? x : 0)),
        x2: Math.max(0, parseInt(line.attr('x2')) + (dimension == 'x' ? x : 0)),
        y1: Math.min(chart.plot_height, parseInt(line.attr('y1')) + (dimension == 'y' ? y : 0)),
        y2: Math.min(chart.plot_height, parseInt(line.attr('y2')) + (dimension == 'y' ? y : 0))
    };
    console.log(attributes);

    line.attr(attributes);
    lineBack.attr(attributes);

    var rawCut = line.attr(dimension + '1');
    var current_cut = +d3.format('0.1f')(chart[dimension].invert(rawCut));

    //update the cut control in real time
    chart.controls.wrap
        .selectAll('div.control-group')
        .filter(f => f.option == 'quadrants.cut_data.' + dimension)
        .select('input')
        .node().value = current_cut;

    chart.config.quadrants.cut_data[dimension] = current_cut;
}
