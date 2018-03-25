export function initVisitPath() {
    //initialize a 'rug' on each axis to show the distribution for a participant on addPointMouseover
    this.visitPath = this.svg.append('g').attr('class', 'visit-path');
}
