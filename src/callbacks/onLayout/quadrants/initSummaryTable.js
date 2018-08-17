import { updateSummaryTable } from './updateSummaryTable';

export function initSummaryTable() {
    var chart = this;
    var config = chart.config;
    var quadrants = this.config.quadrants;

    quadrants.table = {};
    quadrants.table.wrap = this.wrap
        .append('div')
        .attr('class', 'quadrantTable')
        .style('padding-top', '1em');
    quadrants.table.tab = quadrants.table.wrap.append('table').style('border-collapse', 'collapse');

    //table header
    quadrants.table.cells = [
        {
            value_col: 'label',
            label: 'Quadrant'
        },
        {
            value_col: 'count',
            label: '#'
        },
        {
            value_col: 'percent',
            label: '%'
        }
    ];

    if (config.populationProfileURL) {
        quadrants.forEach(function(d) {
            d.link = "<a href='" + config.populationProfileURL + "'>&#128279</a>";
        });
        quadrants.table.cells.push({
            value_col: 'link',
            label: 'Population Profile'
        });
    }
    quadrants.table.thead = quadrants.table.tab
        .append('thead')
        .style('border-top', '2px solid #999')
        .style('border-bottom', '2px solid #999')
        .append('tr')
        .style('padding', '0.1em');

    quadrants.table.thead
        .selectAll('th')
        .data(quadrants.table.cells)
        .enter()
        .append('th')
        .html(d => d.label);

    //table contents
    quadrants.table.tbody = quadrants.table.tab
        .append('tbody')
        .style('border-bottom', '2px solid #999');
    quadrants.table.rows = quadrants.table.tbody
        .selectAll('tr')
        .data(quadrants, d => d.label)
        .enter()
        .append('tr')
        .style('padding', '0.1em');

    //initial table update
    updateSummaryTable.call(this);
}
