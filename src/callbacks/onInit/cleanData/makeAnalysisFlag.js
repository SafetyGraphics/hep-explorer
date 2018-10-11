export default function makeAnalysisFlag() {
    var chart = this;
    var config = this.config;
    console.log(chart.imputed_data);
    this.imputed_data = this.imputed_data.map(function(d) {
        const hasAnalysisSetting =
            (config.analysisFlag.value_col != null) & (config.analysisFlag.values.length > 0);
        d.analysisFlag = hasAnalysisSetting
            ? config.analysisFlag.values.indexOf(d[config.analysisFlag.value_col]) > -1
            : true;
        return d;
    });

    console.log(
        d3.mean(chart.imputed_data, d => d.analysisFlag) + '% of records flagged for analysis.'
    );
}
