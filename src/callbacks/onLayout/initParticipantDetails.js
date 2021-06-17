import { createTable } from 'webcharts';

export function initParticipantDetails() {
    //layout participant details section
    this.participantDetails = {};
    this.participantDetails.wrap = this.wrap.append('div').attr('class', 'participantDetails');

    this.participantDetails.header = this.participantDetails.wrap
        .append('div')
        .attr('class', 'participantHeader');

    //layout spaghettiPlot
    var splot = this.participantDetails.wrap.append('div').attr('class', 'spaghettiPlot');
    splot
        .append('h3')
        .attr('class', 'id')
        .html('Standardized Lab Values by Study Day')
        .style('border-top', '2px solid black')
        .style('border-bottom', '2px solid black')
        .style('padding', '.2em');

    splot.append('div').attr('class', 'chart');

    //layout measure table
    var mtable = this.participantDetails.wrap.append('div').attr('class', 'measureTable');
    mtable
        .append('h3')
        .attr('class', 'id')
        .html('Raw Lab Values Summary Table')
        .style('border-top', '2px solid black')
        .style('border-bottom', '2px solid black')
        .style('padding', '.2em');

    //initialize the measureTable
    var settings = {
        cols: ['key', 'n', 'min', 'median', 'max', 'spark'],
        headers: ['Measure', 'N', 'Min', 'Median', 'Max', ''],
        searchable: false,
        sortable: false,
        pagination: false,
        exportable: false,
        applyCSS: true
    };
    this.measureTable = createTable(this.element + ' .participantDetails .measureTable', settings);
    this.measureTable.init([]);

    //hide the section until needed
    this.participantDetails.wrap.selectAll('*').style('display', 'none');
}
