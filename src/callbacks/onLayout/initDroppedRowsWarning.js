import { downloadCSV } from '../util/downloadCSV';

export function initDroppedRowsWarning() {
    var chart = this;
    if (this.dropped_rows.length > 0) {
        var warningText =
            this.dropped_rows.length +
            ' rows were removed. This is probably because of non-numeric or missing data provided for key variables. Click <a class="rowDownload">here</a> to download a csv with a brief explanation of why each row was removed.';

        this.messages.add(warningText, 'caution', 'droppedRows', this.messages, function() {
            //custom callback to activate the droppedRows download
            d3.select(this)
                .select('a.rowDownload')
                .style('color', 'blue')
                .style('text-decoration', 'underline')
                .style('cursor', 'pointer')
                .datum(chart.dropped_rows)
                .on('click', function(d) {
                    const systemVars = d3.merge([
                        ['dropReason', 'NONE'],
                        Object.keys(chart.config.measure_values)
                    ]);
                    var cols = d3.merge([
                        ['dropReason'],
                        Object.keys(d[0]).filter(f => systemVars.indexOf(f) == -1)
                    ]);
                    downloadCSV.call(this, d, cols);
                });
        });
    }
}
