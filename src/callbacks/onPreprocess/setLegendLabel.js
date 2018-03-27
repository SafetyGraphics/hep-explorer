export function setLegendLabel() {
    //change the legend label to match the group variable
    //or hide legend if group = NONE
    this.config.legend.label =
        this.config.color_by !== 'NONE'
            ? this.config.group_cols[
                  this.config.group_cols.map(group => group.value_col).indexOf(this.config.color_by)
              ].label
            : '';
}
