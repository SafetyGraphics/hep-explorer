import imputeData from './cleanData/imputeData';
import dropRows from './cleanData/dropRows';
import deriveVariables from './cleanData/deriveVariables';
import makeAnalysisFlag from './cleanData/makeAnalysisFlag';

export function cleanData() {
    var chart = this,
        config = this.config;

    //drop rows with invalid data
    this.imputedData = dropRows.call(this);

    this.imputed_data.forEach(function(d) {
        d.impute_flag = false;
    });

    imputeData.call(this);
    deriveVariables.call(this);
    makeAnalysisFlag.call(this);
}
