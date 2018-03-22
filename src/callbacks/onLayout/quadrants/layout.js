import { highlight } from './highlight';
import { clearHighlight } from './clearHighlight';

export function layout() {
    var chart = this;
    var config = chart.config;
    var quadrants = this.config.quadrants;

    //////////////////////////////////////////////////////////
    //layout the cut lines
    /////////////////////////////////////////////////////////
    quadrants.wrap = this.svg.append('g').attr('class', 'quadrants');
    var wrap = quadrants.wrap;

    quadrants.cut_g = wrap
        .selectAll('g.cut')
        .data(quadrants.cut_data)
        .enter()
        .append('g')
        .attr('class', d => 'cut ' + d.dimension);

    quadrants.cut_lines = quadrants.cut_g
        .append('line')
        .attr('class', 'cut-line')
        .attr('dash-array', '5,5')
        .attr('stroke', '#bbb');

    quadrants.cut_labels = quadrants.cut_g
        .append('text')
        .attr('class', 'cut-label')
        .attr('stroke', '#bbb');

    //////////////////////////////////////////////////////////
    //layout the quadrant labels
    /////////////////////////////////////////////////////////

    quadrants.group_labels = this.svg.append('g').attr('class', 'group-labels');

    quadrants.group_labels
        .selectAll('text.quadrant-label')
        .data(quadrants.quadrant_data)
        .enter()
        .append('text')
        .attr('class', d => 'quadrant-label ' + d.position)
        .attr('dy', d => (d.position.search('lower') > -1 ? '-.2em' : '.2em'))
        .attr('dx', d => (d.position.search('right') > -1 ? '-.5em' : '.5em'))
        .attr('text-anchor', d => (d.position.search('right') > 0 ? 'end' : null))
        .attr('fill', '#bbb')
        .style('cursor', 'pointer')
        .text(d => d.label)
        .on('mouseover', function(d) {
            highlight.call(this, d, chart);
        })
        .on('mouseout', function() {
            clearHighlight.call(this, chart);
        });
}
