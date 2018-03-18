import defaultCutData from './initQuadrants/defaultCutData';
import defaultQuadrantData from './initQuadrants/defaultQuadrantData';

export function initQuadrants() {
    var chart = this;
    var config = chart.config;

    //layout the quadrants for hy's law risk levels
    this.config.quadrants = {};
    var quadrants = this.config.quadrants;

    //////////////////////////////////////////////////////////
    //create custom data objects for the lines and quadrants
    /////////////////////////////////////////////////////////
    quadrants.quadrant_data = defaultQuadrantData;

    quadrants.cut_data = defaultCutData;
    quadrants.cut_data.x = null; //Also store the cuts as properties for convenience
    quadrants.cut_data.y = null;

    ///////////////////////////////////////////////////////////
    // set initial values
    //////////////////////////////////////////////////////////
    quadrants.cut_data.x = config.measure_details.find(
        f => config.x.column.search(f.label) > -1
    ).cut[config.display];

    chart.controls.wrap
        .selectAll('div.control-group')
        .filter(f => f.option == 'quadrants.cut_data.x')
        .select('input')
        .node().value =
        quadrants.cut_data.x;

    quadrants.cut_data.y = config.measure_details.find(
        f => config.y.column.search(f.label) > -1
    ).cut[config.display];

    chart.controls.wrap
        .selectAll('div.control-group')
        .filter(f => f.option == 'quadrants.cut_data.y')
        .select('input')
        .node().value =
        quadrants.cut_data.y;

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
            d3.select(this).attr('fill', 'black');
            var matches = chart.marks[0].circles.filter(
                f => f.values.raw[0].eDISH_quadrant == d.dataValue
            );
            matches.attr('stroke-width', 2);
        })
        .on('mouseout', function() {
            d3.select(this).attr('fill', '#bbb');
            chart.marks[0].circles.attr('stroke-width', 1);
        });
}
