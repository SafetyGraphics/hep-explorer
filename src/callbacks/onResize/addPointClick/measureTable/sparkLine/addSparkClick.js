import { init as initLineChart } from '../lineChart/init';

export function addSparkClick() {
    if (this.data.raw.length > 0) {
        this.tbody
            .selectAll('tr')
            .select('td.spark')
            .on('click', function(d) {
                if (d3.select(this).classed('minimized')) {
                    d3.select(this).classed('minimized', false);
                    d3.select(this.parentNode).style('border-bottom', 'none');

                    this.lineChart = initLineChart.call(this, d);
                    d3.select(this)
                        .select('svg')
                        .style('display', 'none');

                    d3.select(this)
                        .select('span')
                        .html('&#x25B3; Minimize Chart');
                } else {
                    d3.select(this).classed('minimized', true);

                    d3.select(this.parentNode).style('border-bottom', '0.5px solid black');

                    d3.select(this)
                        .select('span')
                        .html('&#x25BD;');

                    d3.select(this)
                        .select('svg')
                        .style('display', null);

                    d3.select(this.lineChart.row).remove();
                    this.lineChart.destroy();
                }
            });
    }
}
