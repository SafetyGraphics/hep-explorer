import { merge } from 'd3';
import { clearParticipantDetails } from '../clearParticipantDetails';
export function makeParticipantHeader(d) {
    var chart = this;
    var wrap = this.participantDetails.header;
    var raw = d.values.raw[0];

    var title = this.participantDetails.header
        .append('h3')
        .attr('class', 'id')
        .html('Participant Details')
        .style('border-top', '2px solid black')
        .style('border-bottom', '2px solid black')
        .style('padding', '.2em');

    title
        .append('Button')
        .text('Clear')
        .style('margin-left', '1em')
        .style('float', 'right')
        .on('click', function() {
            clearParticipantDetails.call(chart);
        });

    //show detail variables in a ul
    var ul = this.participantDetails.header
        .append('ul')
        .style('list-style', 'none')
        .style('padding', '0');

    var lis = ul
        .selectAll('li')
        .data(chart.config.details)
        .enter()
        .append('li')
        .style('', 'block')
        .style('display', 'inline-block')
        .style('text-align', 'center')
        .style('padding', '0.5em');

    lis
        .append('div')
        .text(d => d.label)
        .attr('div', 'label')
        .style('font-size', '0.8em');

    lis
        .append('div')
        .text(d => raw[d.value_col])
        .attr('div', 'value');
}
