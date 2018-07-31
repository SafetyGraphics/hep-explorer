export default function checkRequiredVariables() {
    this.varList = [];
    if (this.config.filters) {
        const filterVars = this.config.filters.map(
            d => (d.hasOwnProperty('value_col') ? d.value_col : d)
        );
        this.varList = d3.merge([this.varList, filterVars]);
    }
    if (this.config.group_cols) {
        const groupVars = this.config.group_cols.map(
            d => (d.hasOwnProperty('value_col') ? d.value_col : d)
        );
        this.varList = d3.merge([this.varList, groupVars]);
    }
    if (this.config.details) {
        const detailVars = this.config.details
            .map(d => (d.hasOwnProperty('value_col') ? d.value_col : d))
            .filter(detail => (detail.value_col || detail) !== this.config.id_col);
        this.varList = d3.merge([this.varList, detailVars]);
    }
    const missingVariables = this.varList.filter(
        variable => Object.keys(this.raw_data[0]).indexOf(variable) < 0
    );
    if (missingVariables.length > 0)
        alert(
            `The data are missing ${
                missingVariables.length === 1 ? 'this variable' : 'these variables'
            }: ${missingVariables.join(', ')}.`
        );
}
