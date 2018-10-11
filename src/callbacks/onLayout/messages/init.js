import { add as addMessage } from './add';
import { remove as removeMessage } from './remove';
import { update as updateMessage } from './update';

export function init() {
    var chart = this;
    this.messages = {
        add: addMessage,
        remove: removeMessage,
        update: updateMessage
    };
    //  this.messages.add = addMessage;
    //  this.messages.remove = removeMessage;
    this.messages.list = [];
    this.messages.wrap = this.controls.wrap.insert('div', '*').style('margin', '0 1em 1em 0');
    this.messages.header = this.messages.wrap
        .append('div')
        .style('border-top', '1px solid black')
        .style('border-bottom', '1px solid black')
        .style('font-weight', 'strong')
        .style('margin', '0 1em 1em 0');

    this.messages.header.title = this.messages.header
        .append('div')
        .attr('class', 'title')
        .style('display', 'inline-block')
        .text('Messages (0)');

    this.messages.header.clear = this.messages.header
        .append('div')
        .text('Clear')
        .style('font-size', '0.8em')
        .style('vertical-align', 'center')
        .style('display', 'inline-block')
        .style('float', 'right')
        .style('color', 'blue')
        .style('cursor', 'pointer')
        .style('text-decoration', 'underline')
        .on('click', function() {
            chart.messages.remove(null, 'all', chart.messages);
        });
}
