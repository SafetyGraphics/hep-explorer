import defaultCutData from './initQuadrants/defaultCutData';
import defaultQuadrantData from './initQuadrants/defaultQuadrantData';

export function initQuadrants() {
    //layout the quadrants for hy's law risk levels
    this.quadrants = {};

    //////////////////////////////////////////////////////////
    //create custom data objects for the lines and quadrants
    /////////////////////////////////////////////////////////
    console.log('just a test');
    this.quadrants.quadrant_data = defaultQuadrantData;

    this.quadrants.cut_data = defaultCutData;
    this.quadrants.cut_data.x = null; //Also store the cuts as properties for convenience
    this.quadrants.cut_data.y = null;

    //////////////////////////////////////////////////////////
    //layout the cut lines
    /////////////////////////////////////////////////////////
    this.quadrants.wrap = this.svg.append('g').attr('class', 'quadrants');
    var wrap = this.quadrants.wrap;

    this.quadrants.cut_g = wrap
        .selectAll('g.cut')
        .data(this.quadrants.cut_data)
        .enter()
        .append('g')
        .attr('class', d => 'cut ' + d.dimension);

    this.quadrants.cut_lines = this.quadrants.cut_g
        .append('line')
        .attr('class', 'cut-line')
        .attr('dash-array', '5,5')
        .attr('stroke', '#bbb');

    this.quadrants.cut_labels = this.quadrants.cut_g
        .append('text')
        .attr('class', 'cut-label')
        .attr('stroke', '#bbb');

    //////////////////////////////////////////////////////////
    //layout the quadrant labels
    /////////////////////////////////////////////////////////
    this.quadrants.group_labels = this.svg.append('g').attr('class', 'group-labels');

    this.quadrants.group_labels
        .selectAll('text.quadrant-label')
        .data(this.quadrants.quadrant_data)
        .enter()
        .append('text')
        .attr('class', d => 'quadrant-label ' + d.position)
        .text(d => d.label)
        .attr('fill', '#bbb');
}
