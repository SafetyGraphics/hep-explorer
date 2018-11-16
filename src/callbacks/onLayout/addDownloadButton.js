import { downloadCSV } from '../util/downloadCSV';

export function addDownloadButton() {
    var chart = this;
    var config = this.config;
    if (config.downloadLink) {
        this.titleDiv
            .select('span')
            .append('a')
            .attr('class', 'downloadRaw')
            .html('&#x2193; Raw Data')
            .attr('title', 'Download Raw Data')
            .style('font-size', '.5em')
            .style('margin-left', '1em')
            .style('border', '1px solid black')
            .style('border-radius', '2px')
            .style('padding', '2px 4px')
            .style('text-align', 'center')
            .style('display', 'inline-block')
            .style('cursor', 'pointer')
            .style('font-weight', 'bold')
            .datum(chart.initial_data)
            .on('click', function(d) {
                var systemVars = [
                    'dropReason',
                    'NONE',
                    'ALT',
                    'TB',
                    'impute_flag',
                    'key_measure',
                    'analysisFlag'
                ];
                var cols = Object.keys(d[0]).filter(f => systemVars.indexOf(f) == -1);
                downloadCSV.call(this, d, cols, 'eDishRawData');
            });
    }
}
