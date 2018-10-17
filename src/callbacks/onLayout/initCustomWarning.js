export function initCustomWarning() {
    if (this.config.warningText) {
        this.messages.add(this.config.warningText, 'caution', 'validationCaution', this.messages);
    }
}
