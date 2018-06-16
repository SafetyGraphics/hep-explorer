import { createTable } from 'webcharts';

export function initParticipantDetails() {
    //layout participant details section
    this.participantDetails = {};
    this.participantDetails.wrap = this.wrap.append('div').attr('class', 'participantDetails');

    this.participantDetails.header = this.participantDetails.wrap
        .append('div')
        .attr('class', 'participantHeader');
    this.participantDetails.wrap.append('div').attr('class', 'spaghettiPlot');
    this.participantDetails.wrap.append('div').attr('class', 'measureTable');

    //initialize the measureTable
    var settings = {
        cols: ['key', 'n', 'min', 'median', 'max', 'spark'],
        headers: ['Measure', 'N', 'Min', 'Median', 'Max', ''],
        searchable: false,
        sortable: false,
        pagination: false,
        exportable: false,
        applyCSS: true,
        visitn_col: this.visitn_col,
        value_col: this.value_col
    };

    this.measureTable = createTable(this.element + ' .participantDetails .measureTable', settings);
    this.measureTable.init([]);

    //hide the section until needed
    this.participantDetails.wrap.selectAll('*').style('display', 'none');
}
