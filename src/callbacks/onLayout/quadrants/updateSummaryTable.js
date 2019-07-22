export function updateSummaryTable() {
    var chart = this;
    var config = chart.config;
    var quadrants = this.config.quadrants;
    var rows = quadrants.table.rows;
    var cells = quadrants.table.cells;

    function updateCells(d) {
        var cellData = cells.map(function(cell) {
            cell.value = d[cell.value_col];
            return cell;
        });
        var row_cells = d3
            .select(this)
            .selectAll('td')
            .data(cellData, d => d.value_col);

        row_cells
            .enter()
            .append('td')
            .style('text-align', function(d, i) {
                return d.label != 'Quadrant' ? 'center' : null;
            })
            .style('font-size', '0.9em')
            .style('padding', '0 0.5em 0 0.5em');

        row_cells.html(d => d.value);
    }

    //make sure the table is visible
    this.config.quadrants.table.wrap.style('display', null);
    //update the content of each row
    rows.data(quadrants, d => d.label);
    rows.each(updateCells);
}
