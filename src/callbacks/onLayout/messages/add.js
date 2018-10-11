export function add(messageText, type, label, messages, callback) {
    var messageObj = {
        id: messages.list.length + 1,
        type: type,
        message: messageText,
        label: label,
        hidden: false,
        callback: callback
    };
    messages.list.push(messageObj);
    messages.update(messages);
}
