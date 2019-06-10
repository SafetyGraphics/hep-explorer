export default function stopTransition() {
    console.log('Transition Stopping');
    chart.myTransition.duration(0);
    chart.draw();
}
