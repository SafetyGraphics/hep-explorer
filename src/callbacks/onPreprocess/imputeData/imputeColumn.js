export function imputeColumn(
    data,
    measure_column,
    value_column,
    measure,
    llod,
    imputed_value,
    drop
) {
    //returns a data set with imputed values (or drops records) for records at or below a lower threshold for a given measure
    //data = the data set for imputation
    //measure_column = the column with the text measure names
    //value_column = the column with the numeric values to be changed via imputation
    //measure = the measure to be imputed
    //llod = the lower limit of detection - values at or below the llod are imputed
    //imputed_value = value for imputed records
    //drop = boolean flag indicating whether values at or below the llod should be dropped (default = false)

    if (drop == undefined) drop = false;

    data.forEach(function(d) {
        if ((d[measure_column] == measure) & (d[value_column] <= llod)) {
            d.impute_flag = true;
            d[value_column] = imputed_value;
        }
    });

    if (drop) {
        return data.filter(f => !f.impute_flag);
    } else {
        return data;
    }
}
