export function addExtraMeasureToggle() {
    var measureTable = this;
    var chart = this.edish;
    var config = chart.config;

    measureTable.wrap.selectAll('div.wc-controls').remove();

    //check to see if there are extra measures in the MeasureTable
    const specifiedMeasures = Object.keys(config.measure_values).map(e => config.measure_values[e]);
    const tableMeasures = measureTable.data.raw.map(f => f.key);

    //if extra measure exist...
    if (tableMeasures.length > specifiedMeasures.length) {
        var extraRows = measureTable.table
            .select('tbody')
            .selectAll('tr')
            .filter(f => specifiedMeasures.indexOf(f.key) == -1);

        //hide extra rows by default
        extraRows.style('display', 'none');

        //add a toggle
        var toggleDiv = measureTable.wrap
            .insert('div', '*')
            .attr('class', 'wc-controls')
            .append('div')
            .attr('class', 'control-group');
        var extraCount = tableMeasures.length - specifiedMeasures.length;
        toggleDiv
            .append('span')
            .attr('class', 'wc-control-label')
            .style('display', 'inline-block')
            .style('padding-right', '.3em')
            .text(
                'Show ' + extraCount + ' additional measure' + (extraCount == 1 ? '' : 's') + ':'
            );
        var toggle = toggleDiv.append('input').property('type', 'checkbox');
        toggle.on('change', function() {
            var showRows = this.checked;
            extraRows.style('display', showRows ? null : 'none');
        });
    }
}
