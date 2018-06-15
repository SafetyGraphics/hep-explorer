export function layoutPanels() {
    this.wrap.style('display', 'inline-block').style('width', '75%');

    this.controls.wrap
        .style('display', 'inline-block')
        .style('width', '25%')
        .style('vertical-align', 'top');

    this.controls.wrap.selectAll('div.control-group').style('display', 'block');
    this.controls.wrap
        .selectAll('div.control-group')
        .select('select')
        .style('width', '200px');
}
