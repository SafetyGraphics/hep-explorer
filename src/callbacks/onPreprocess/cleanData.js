import imputeData from './cleanData/imputeData';
import deriveVariables from './cleanData/deriveVariables';

export function cleanData() {
    var chart = this,
        config = this.config;

    //Remove missing values via the ultimate number regular expression.
    this.imputed_data = this.initial_data.filter(d =>
        /^-?(\d*\.?\d+|\d+\.?\d*)(E-?\d+)?$/.test(d[this.config.value_col])
    );
    this.imputed_data.forEach(function(d) {
        d.impute_flag = false;
    });

    imputeData.call(this);
    deriveVariables.call(this);
}
