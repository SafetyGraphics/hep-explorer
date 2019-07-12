export default function onPreprocess() {
    const config = this.config;
    const unit = this.config.y.column == 'relative_uln' ? '[xULN]' : '[xBaseline]';
    config.y.label = 'Standardized Result ' + unit;
}
