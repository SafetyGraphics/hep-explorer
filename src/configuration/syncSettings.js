//Replicate settings in multiple places in the settings object
export default function syncSettings(settings) {
    settings.marks[0].per[0] = settings.id_col;

    //set grouping config
    if (typeof settings.group_cols == 'string') {
        settings.group_cols = [{ value_col: settings.group_cols, label: settings.group_cols }];
    }

    if (!(settings.group_cols instanceof Array && settings.group_cols.length)) {
        settings.group_cols = [{ value_col: 'NONE', label: 'None' }];
    } else {
        settings.group_cols = settings.group_cols.map(group => {
            return {
                value_col: group.value_col || group,
                label: group.label || group.value_col || group
            };
        });

        const hasNone = settings.group_cols.map(m => m.value_col).indexOf('NONE') > -1;
        if (!hasNone) {
            settings.group_cols.unshift({ value_col: 'NONE', label: 'None' });
        }
    }

    if (settings.group_cols.length > 1) {
        settings.color_by = settings.group_cols[1].value_col
            ? settings.group_cols[1].value_col
            : settings.group_cols[1];
    } else {
        settings.color_by = 'NONE';
    }

    //make sure filters is an Array
    if (!(settings.filters instanceof Array)) {
        settings.filters = typeof settings.filters == 'string' ? [settings.filters] : '';
    }

    //Define default details.
    let defaultDetails = [{ value_col: settings.id_col, label: 'Subject Identifier' }];
    if (settings.filters) {
        settings.filters.forEach(function(filter) {
            var obj = {
                value_col: filter.value_col ? filter.value_col : filter,
                label: filter.label ? filter.label : filter.value_col ? filter.value_col : filter
            };

            if (defaultDetails.find(f => f.value_col == obj.value_col) == undefined) {
                defaultDetails.push(obj);
            }
        });
    }

    if (settings.group_cols) {
        settings.group_cols
            .filter(f => f.value_col != 'NONE')
            .forEach(function(group) {
                var obj = {
                    value_col: group.value_col ? group.value_col : filter,
                    label: group.label ? group.label : group.value_col ? group.value_col : filter
                };
                if (defaultDetails.find(f => f.value_col == obj.value_col) == undefined) {
                    defaultDetails.push(obj);
                }
            });
    }

    //If [settings.details] is not specified:
    if (!settings.details) settings.details = defaultDetails;
    else {
        //If [settings.details] is specified:
        //Allow user to specify an array of columns or an array of objects with a column property
        //and optionally a column label.
        settings.details.forEach(detail => {
            if (
                defaultDetails
                    .map(d => d.value_col)
                    .indexOf(detail.value_col ? detail.value_col : detail) === -1
            )
                defaultDetails.push({
                    value_col: detail.value_col ? detail.value_col : detail,
                    label: detail.label
                        ? detail.label
                        : detail.value_col
                        ? detail.value_col
                        : detail
                });
        });
        settings.details = defaultDetails;
    }

    // If settings.analysisFlag is null
    if (!settings.analysisFlag) settings.analysisFlag = { value_col: null, values: [] };

    //if it is null, set settings.baseline.value_col to settings.studyday_col.
    if (!settings.baseline) settings.baseline = { value_col: null, values: [] };
    if (settings.baseline.values.length == 0) settings.baseline.values = [0];
    if (!settings.baseline.value_col) settings.baseline.value_col = settings.studyday_col;

    //parse x_ and y_options to array if needed
    if (typeof settings.x_options == 'string') settings.x_options = [settings.x_options];
    if (typeof settings.y_options == 'string') settings.y_options = [settings.y_options];

    // track initial Cutpoint (lets us detect when cutpoint should change)
    settings.cuts.x = settings.x.column;
    settings.cuts.y = settings.y.column;
    settings.cuts.display = settings.display;

    //Attach measure columns to axis settings.
    settings.x.column = settings.x_options[0];
    settings.y.column = settings.y_options[0];

    return settings;
}
