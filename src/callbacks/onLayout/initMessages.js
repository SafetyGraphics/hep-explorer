export function initMessages() {
    this.controls.messages = {};
    this.controls.messages.wrap = this.controls.wrap.insert('div', '*');
    this.controls.messages.count = 0;
    this.controls.messages.header = this.controls.messages.wrap.append('div');
    this.controls.messages.header
        .append('span')
        .attr('class', 'toggle')
        .html('&#9660;');
    this.controls.messages.header
        .append('span')
        .attr('class', 'title')
        .text('Messages');
}
