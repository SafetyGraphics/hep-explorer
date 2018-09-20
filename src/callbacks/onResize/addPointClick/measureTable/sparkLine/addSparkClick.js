import { init as initLineChart } from '../lineChart/init';
export function addSparkClick() {
    if (this.data.raw.length > 0) {
        this.tbody
            .selectAll('tr')
            .select('td.spark')
            .on('click', function(d) {
                initLineChart.call(this, d);
            });
    }
}
