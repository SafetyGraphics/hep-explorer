export function updateFilterLabel() {
    if (this.controls.filter_numerator) {
        this.controls.filter_numerator.text(this.filtered_data.length);
    }
}
