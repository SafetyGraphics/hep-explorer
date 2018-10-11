export function hideMeasureTable() {
    this.measureTable.draw([]);
    this.measureTable.wrap.selectAll('*').style('display', 'none');
}
