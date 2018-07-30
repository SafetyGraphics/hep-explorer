//Replicate settings in multiple places in the settings object
export default function syncSettings(settings) {
    settings.marks[0].per[0] = settings.id_col;

    //set grouping config
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
        settings.group_cols.filter(f => f.value_col != 'NONE').forEach(function(group) {
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
                        : detail.value_col ? detail.value_col : detail
                });
        });
        settings.details = defaultDetails;
    }

    //Attach measure details to axis settings.
    settings.x.measure_detail = settings.measure_details.find(measure_detail => measure_detail.axis === 'x');
    settings.y.measure_detail = settings.measure_details.find(measure_detail => measure_detail.axis === 'y');

    return settings;
}
