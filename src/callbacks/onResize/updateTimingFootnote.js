export default function updateTimingFootnote() {
    var chart = this;
    var config = this.config;
    const windowText =
        config.visit_window == 0
            ? 'on the same day'
            : config.visit_window == 1
            ? 'within 1 day'
            : 'within ' + config.visit_window + ' days';
    var timingFootnote =
        ' Points where maximum ' +
        config.measure_values[config.x.column] +
        ' and ' +
        config.measure_values[config.y.column] +
        ' values were collected ' +
        windowText +
        ' are filled, others are empty.';

    this.footnote.timing.text(timingFootnote);
}
