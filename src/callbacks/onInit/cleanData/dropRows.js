export default function dropRows() {
    var config = this.config;
    this.dropped_rows = [];

    /////////////////////////
    // Remove invalid rows
    /////////////////////////

    this.imputed_data = this.initial_data
        .filter(d => {
            //Remove non-numeric value_col
            var numericValueCol = /^-?(\d*\.?\d+|\d+\.?\d*)(E-?\d+)?$/.test(
                d[this.config.value_col]
            );
            if (!numericValueCol) {
                d.dropReason = `Value Column ("${config.value_col}") is not numeric.`;
                this.dropped_rows.push(d);
            }
            return numericValueCol;
        })
        .filter(d => {
            //Remove non-numeric visit_col
            var numericVisitCol = /^-?(\d*\.?\d+|\d+\.?\d*)(E-?\d+)?$/.test(
                d[this.config.visitn_col]
            );
            if (!numericVisitCol) {
                d.dropReason = `Visit Column ("${config.visitn_col}")is not numeric.`;
                this.dropped_rows.push(d);
            }
            return numericVisitCol;
        });
}
