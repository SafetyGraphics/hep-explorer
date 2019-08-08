export function initCustomEvents() {
    var chart = this;
    chart.participantsSelected = [];
    chart.events.participantsSelected = new CustomEvent('participantsSelected');
}
