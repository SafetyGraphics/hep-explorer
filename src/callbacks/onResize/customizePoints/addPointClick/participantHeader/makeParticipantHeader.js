import { clearParticipantDetails } from '../../clearParticipantDetails';

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

    if (chart.config.participantProfileURL) {
        title
            .append('a')
            .html('Full Participant Profile')
            .attr('href', chart.config.participantProfileURL)
            .style('font-size', '0.8em')
            .style('padding-left', '1em');
    }

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

    lis.append('div')
        .text(d => d.label)
        .style('font-size', '0.8em');

    lis.append('div').text(d => raw[d.value_col]);

    //show overall rRatio
    var rratio_li = ul
        .append('li')
        .style('', 'block')
        .style('display', 'inline-block')
        .style('text-align', 'center')
        .style('padding', '0.5em');

    rratio_li
        .append('div')
        .html('R Ratio')
        .style('font-size', '0.8em');

    rratio_li.append('div').text(d3.format('0.2f')(raw.rRatio));

    //show PALT`
    if (raw.p_alt) {
        var palt_li = ul
            .append('li')
            .style('', 'block')
            .style('display', 'inline-block')
            .style('text-align', 'center')
            .style('padding', '0.5em');

        palt_li
            .append('div')
            .html('P<sub>ALT</sub>')
            .style('font-size', '0.8em');

        palt_li
            .append('div')
            .text(raw.p_alt.text_value)
            .style('border-bottom', '1px dotted #999')
            .style('cursor', 'pointer')
            .on('click', function() {
                wrap.select('p.footnote')
                    .attr('class', 'footnote')
                    .html(raw.p_alt.note);
            });
    }

    //initialize empty footnote
    wrap.append('p')
        .attr('class', 'footnote')
        .style('font-size', '0.7em')
        .style('padding', '0.5em');
}
