import { createTable } from 'webcharts';

export function initMeasureTable() {
    var settings = {
        cols: ['key', 'n', 'min', 'median', 'max', 'spark'],
        headers: ['Measure', 'N', 'Min', 'Median', 'Max', ''],
        searchable: true,
        sortable: true,
        pagination: false,
        exportable: true,
        visitn_col: this.visitn_col,
        value_col: this.value_col
    };
    this.measureTable = createTable(this.element, settings);
    this.measureTable.init([]);
    this.measureTable.wrap.selectAll('*').style('display', 'none');
}
