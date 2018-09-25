export function update(messages) {
    function jsUcfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    var visibleMessages = messages.list.filter(f => f.hidden == false);

    //update title
    messages.header.title.text('Messages (' + visibleMessages.length + ')');

    //
    var messageDivs = messages.wrap.selectAll('div.message').data(visibleMessages, d => d.id);

    messageDivs
        .enter()
        .append('div')
        .attr('class', d => d.type + ' message')
        .html(d => '<strong>' + jsUcfirst(d.type) + '</strong>: ' + d.message)
        .style('border-radius', '.5em')
        .style('margin-right', '1em')
        .style('margin-bottom', '1em')
        .style('padding', '0.4em');

    messageDivs.each(function(d) {
        var type = d.type;
        var thisMessage = d3.select(this);
        if (type == 'caution') {
            thisMessage
                .style('border', '1px solid #faebcc')
                .style('color', '#8a6d3b')
                .style('background-color', '#fcf8e3');
        } else if (type == 'warning') {
            thisMessage
                .style('border', '1px solid #ebccd1')
                .style('color', '#a94442')
                .style('background-color', '#f2dede');
        } else {
            thisMessage
                .style('border', '1px solid #999')
                .style('color', '#999')
                .style('background-color', null);
        }
    });

    messageDivs.exit().remove();
}
