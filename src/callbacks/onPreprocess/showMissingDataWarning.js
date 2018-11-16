import { downloadCSV } from '../util/downloadCSV';

export function showMissingDataWarning() {
    var chart = this;
    var config = chart.config;

    if (config.debug) {
        //confirm participants are only dropped once (?!)
        var unique_dropped_participants = d3.set(this.dropped_participants.map(m => m.id)).values()
            .length;
        console.log(
            'Of ' +
                this.dropped_participants.length +
                ' dropped participants, ' +
                unique_dropped_participants +
                ' are unique.'
        );
        console.log(this.dropped_participants);
    }

    chart.messages.remove(null, 'droppedPts', chart.messages); //remove message from previous render
    if (this.dropped_participants.length > 0) {
        var warningText =
            this.dropped_participants.length +
            ' participants are not plotted. They likely have invalid or missing data for key variables in the current chart. Click <a class="ptDownload">here</a> to download a csv with a brief explanation of why each participant was not plotted.';

        this.messages.add(warningText, 'caution', 'droppedPts', this.messages, function() {
            //custom callback to activate the droppedRows download
            d3.select(this)
                .select('a.ptDownload')
                .style('color', 'blue')
                .style('text-decoration', 'underline')
                .style('cursor', 'pointer')
                .datum(chart.dropped_participants)
                .on('click', function(d) {
                    var cols = ['id', 'drop_reason'];
                    downloadCSV.call(this, d, cols, 'eDishDroppedParticipants');
                });
        });
    }
}
