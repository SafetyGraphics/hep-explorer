export function initRugs() {
    //initialize a 'rug' on each axis to show the distribution for a participant on addPointMouseover
    this.x_rug = this.svg.append('g').attr('class', 'rug x');
    this.y_rug = this.svg.append('g').attr('class', 'rug y');
}
