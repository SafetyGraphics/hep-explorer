export default function drawCutLine(d) {
    //bit of a hack to make this work with paths and circles
    const spaghetti = this;
    const config = this.config;
    const raw = d.values.raw ? d.values.raw[0] : d.values[0].values.raw[0];
    const cut = raw[config.y.column + '_cut'];
    const param = raw[config.color_by];
    spaghetti.cutLine = spaghetti.svg
        .append('line')
        .attr('y1', spaghetti.y(cut))
        .attr('y2', spaghetti.y(cut))
        .attr('x1', 0)
        .attr('x2', spaghetti.plot_width)
        .attr('stroke', spaghetti.colorScale(param))
        .attr('stroke-dasharray', '3 3');
    spaghetti.cutLabel = spaghetti.svg
        .append('text')
        .attr('y', spaghetti.y(cut))
        .attr('dy', '-0.2em')
        .attr('x', spaghetti.plot_width)
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'baseline')
        .attr('fill', spaghetti.colorScale(param))
        .text(d3.format('0.1f')(cut));
}
