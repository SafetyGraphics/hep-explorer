export default function onResize() {
    this.marks[1].circles.attr('fill-opacity', function(d) {
        console.log(d);
        return d.values.raw[0].flagged ? 1 : 0;
    });
}
