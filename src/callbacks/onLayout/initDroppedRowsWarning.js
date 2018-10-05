import { downloadCSV } from '../util/downloadCSV';

export function initDroppedRowsWarning() {
    var chart = this;
    if (this.dropped_rows.length > 0) {
        var warningText =
            this.dropped_rows.length +
            ' rows were removed because of invalid data. Click <a class="rowDownload">here</a> to download a csv with a brief explanation of why each row was removed.';

        this.messages.add(warningText, 'caution', 'droppedRows', this.messages, function() {
            //custom callback to activate the droppedRows download
            d3
                .select(this)
                .select('a.rowDownload')
                .style('color', 'blue')
                .style('text-decoration', 'underline')
                .style('cursor', 'pointer')
                .datum(chart.dropped_rows)
                .on('click', function(d) {
                    downloadCSV.call(this, d);
                });
        });
    }
}
