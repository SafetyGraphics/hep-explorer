export function dropMissingValues() {
    var config = this.config;
    //drop records with missing or invalid (negative) values
    var missing_count = d3.sum(
        this.raw_data,
        f => f[config.x.column] <= 0 || f[config.y.column] <= 0
    );

    if (this.missingDiv) this.missingDiv.remove();
    if (missing_count > 0) {
        this.wrap
            .append('span')
            .classed('se-footnote', true)
            .text();

        var warningText =
            'Warning: Data not shown for ' +
            missing_count +
            ' participant(s) with invalid data. This could be due to negative or 0 lab values or to missing baseline values when viewing mDish.';

        this.missingDiv = this.controls.messages.wrap
            .append('div')
            .attr('class', 'warning')
            .style('border', '1px solid #ebccd1')
            .style('border-radius', '0.2em')
            .style('margin-right', '1em')
            .style('margin-bottom', '1em')
            .style('padding', '0.4em')
            .style('color', '#a94442')
            .style('background-color', '#f2dede')
            .text(warningText);
        this.raw_data = this.raw_data.filter(
            f => (f[config.x.column] > 0) & (f[config.y.column] > 0)
        );
    }
}
