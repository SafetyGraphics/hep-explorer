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
                if (d3.event.altKey) {
                    let nrRatioData = d3.merge(
                        chart.raw_data.map(function(m) {
                            let obj = m.nrRatio_raw;
                            obj.forEach(function(mm) {
                                mm.id = m[config.id_col];
                            });
                            return obj;
                        })
                    );
                    let cols = Object.keys(nrRatioData[0]);
                    downloadCSV.call(this, nrRatioData, cols, 'eDish_nrRatioData_testing');
                } else if (d3.event.shiftKey) {
                    let cols = Object.keys(chart.raw_data[0]);
                    downloadCSV.call(this, chart.raw_data, cols, 'eDish_RawData_testing');
                } else {
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
                    downloadCSV.call(this, d, cols, 'eDish_InitialData');
                }
            });
    }
}
