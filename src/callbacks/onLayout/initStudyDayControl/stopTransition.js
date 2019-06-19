export default function stopTransition() {
    console.log('Transition Stopping');
    this.myTransition.duration(0);
    this.draw();
}
