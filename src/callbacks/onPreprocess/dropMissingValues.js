import { showMissingDataWarning } from './showMissingDataWarning';
export function dropMissingValues() {
    var chart = this;
    var config = this.config;
    //drop records with missing or invalid (negative) values
    var missing_count = d3.sum(
        this.raw_data,
        f => f[config.x.column] <= 0 || f[config.y.column] <= 0
    );

    if (missing_count > 0) {
        this.raw_data = this.raw_data.map(function(d) {
            d.nonPositiveFlag = d[config.x.column] <= 0 || d[config.y.column] <= 0;
            const type = config.display == 'relative_uln' ? 'eDish' : 'mDish';
            // generate an informative reason the participant was dropped
            var dropText =
                type +
                ' values could not be generated for ' +
                config.x.column +
                ' or ' +
                config.y.column +
                '. ';

            // x type is mdish and baseline is missing
            if ((type == 'mDish') & !d[config.x.column + '_baseline_absolute']) {
                dropText = dropText + 'Baseline for ' + config.x.column + ' is missing. ';
            }

            // y type is mdish and baseline is missing
            if ((type == 'mDish') & !d[config.y.column + '_baseline_absolute']) {
                dropText = dropText + 'Baseline for ' + config.y.column + ' is missing. ';
            }

            d.drop_reason = d.nonPositiveFlag ? dropText : '';
            return d;
        });

        this.dropped_participants = d3.merge([
            this.dropped_participants,
            this.raw_data
                .filter(f => f.nonPositiveFlag)
                .map(m => ({ id: m[config.id_col], drop_reason: m.drop_reason }))
        ]);

        this.dropped_participants.map(function(m) {
            m.raw = chart.initial_data.filter(f => f[config.id_col] == m.id);
        });
    }

    this.raw_data = this.raw_data.filter(f => !f.nonPositiveFlag);
    showMissingDataWarning.call(this);
}
