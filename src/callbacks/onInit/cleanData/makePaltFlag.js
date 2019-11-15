export default function makePaltFlag() {
    var chart = this;
    var config = this.config;
    this.imputed_data = this.imputed_data.map(function(d) {
        const hasPaltSetting =
            config.paltFlag.value_col != null && config.paltFlag.values.length > 0;
        d.paltFlag = hasPaltSetting
            ? config.paltFlag.values.indexOf(d[config.paltFlag.value_col]) > -1
            : true;
        return d;
    });
}
