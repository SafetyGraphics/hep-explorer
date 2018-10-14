export function remove(id, label, messages) {
    // hide the the message(s) by id or label
    if (id) {
        var matches = messages.list.filter(f => +f.id == +id);
    } else if (label.length) {
        var matches = messages.list.filter(f => (label == 'all' ? true : f.label == label));
    }
    matches.forEach(function(d) {
        d.hidden = true;
    });
    messages.update(messages);
}
