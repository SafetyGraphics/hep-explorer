export default function stopAnimation() {
    console.log('Animation Stopping');

    this.myTransition.duration(0);
    this.draw();
}
