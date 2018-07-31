import iterateOverMeasureDetails from './imputeData/iterateOverMeasureDetails';
import deriveVariables from './imputeData/deriveVariables';

export function imputeData() {
    var chart = this,
        config = this.config;

    //Remove missing values via the ultimate number regular expression.
    this.imputed_data = this.initial_data.filter(d => {
        return /^-?(\d*\.?\d+|\d+\.?\d*)(E-?\d+)?$/.test(d[this.config.value_col]);
    });
    this.imputed_data.forEach(function(d) {
        d.impute_flag = false;
    });

    iterateOverMeasureDetails.call(this);
    deriveVariables.call(this);
}
