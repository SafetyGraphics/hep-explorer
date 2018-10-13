export function update(messages) {
    function jsUcfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    var visibleMessages = messages.list.filter(f => f.hidden == false);

    //update title
    messages.header.title.text('Messages (' + visibleMessages.length + ')');

    //
    var messageDivs = messages.wrap.selectAll('div.message').data(visibleMessages, d => d.id);

    var newMessages = messageDivs
        .enter()
        .append('div')
        .attr('class', d => d.type + ' message ' + d.label)
        .html(function(d) {
            var messageText = '<strong>' + jsUcfirst(d.type) + '</strong>: ' + d.message;
            return messageText.split('.')[0] + '.';
        })
        .style('border-radius', '.5em')
        .style('margin-right', '1em')
        .style('margin-bottom', '0.5em')
        .style('padding', '0.2em')
        .style('font-size', '0.9em');

    newMessages
        .append('div.expand')
        .html('•••')
        .style('background', 'white')
        .style('display', 'inline-block')
        .style('border', '1px solid #999')
        .style('padding', '0 0.2em')
        .style('margin-left', '0.3em')
        .style('font-size', '0.4em')
        .style('border-radius', '0.6em')
        .style('cursor', 'pointer')
        .on('click', function(d) {
            console.log(d);
            d3.select(this.parentNode)
                .html(d => '<strong>' + jsUcfirst(d.type) + '</strong>: ' + d.message)
                .each(function(d) {
                    if (d.callback) {
                        console.log('callback');
                        d.callback.call(this.parentNode);
                    }
                });
        });

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

        if (d.callback) {
            d.callback.call(this);
        }
    });

    messageDivs.exit().remove();
}
