export function add(messageText, type, label, messages) {
    var messageObj = {
        id: messages.list.length + 1,
        type: type,
        message: messageText,
        label: label,
        hidden: false
    };
    messages.list.push(messageObj);
    messages.update(messages);
}
