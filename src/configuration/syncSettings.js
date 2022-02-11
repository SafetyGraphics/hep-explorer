import getDefaults from './settings';

//Replicate settings in multiple places in the settings object
export default function syncSettings(settings) {
    const defaults = getDefaults();
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
        settings.filters = typeof settings.filters == 'string' ? [settings.filters] : [];
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

    //parse details to array if needed
    if (!(settings.details instanceof Array)) {
        settings.details = typeof settings.details == 'string' ? [settings.details] : [];
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
    if (!settings.analysisFlag.value_col) settings.analysisFlag.value_col = null;
    if (!(settings.analysisFlag.values instanceof Array)) {
        settings.analysisFlag.values =
            typeof settings.analysisFlag.values == 'string' ? [settings.analysisFlag.values] : [];
    }

    //if it is null, set settings.baseline.value_col to settings.studyday_col.
    if (!settings.baseline) settings.baseline = { value_col: null, values: [] };
    if (!settings.baseline.value_col) settings.baseline.value_col = settings.studyday_col;
    if (!(settings.baseline.values instanceof Array)) {
        settings.baseline.values =
            typeof settings.baseline.values == 'string' ? [settings.baseline.values] : [];
    }

    //merge in default measure_values if user hasn't specified changes
    Object.keys(defaults.measure_values).forEach(function(val) {
        if (!settings.measure_values.hasOwnProperty(val))
            settings.measure_values[val] = defaults.measure_values[val];
    });

    //check for 'all' in x_, y_ and point_size_options, but keep track if all options are used for later
    const allMeasures = Object.keys(settings.measure_values);
    settings.x_options_all = settings.x_options == 'all';
    if (settings.x_options == 'all') settings.x_options = allMeasures;
    settings.y_options_all = settings.y_options == 'all';
    if (settings.y_options == 'all') settings.y_options = allMeasures;
    settings.point_size_options_all = settings.point_size_options == 'all';
    if (settings.point_size_options == 'all') settings.point_size_options = allMeasures;

    //parse x_ and y_options to array if needed
    if (!(settings.x_options instanceof Array)) {
        settings.x_options = typeof settings.x_options == 'string' ? [settings.x_options] : [];
    }

    if (!(settings.y_options instanceof Array)) {
        settings.y_options = typeof settings.y_options == 'string' ? [settings.y_options] : [];
    }

    //set starting values for axis and point size settings.
    settings.point_size =
        settings.point_size_options.indexOf(settings.point_size_default) > -1
            ? settings.point_size_default
            : settings.point_size_default == 'rRatio'
            ? 'rRatio'
            : 'Uniform';
    settings.x.column =
        settings.x_options.indexOf(settings.x_default) > -1
            ? settings.x_default
            : settings.x_options[0];
    settings.y.column =
        settings.y_options.indexOf(settings.y_default) > -1
            ? settings.y_default
            : settings.y_options[0];

    // track initial Cutpoint  (lets us detect when cutpoint should change)
    settings.cuts.x = settings.x.column;
    settings.cuts.y = settings.y.column;
    settings.cuts.display = settings.display;

    // Confirm detault cuts are set
    settings.cuts.defaults = settings.cuts.defaults || defaults.cuts.defaults;
    settings.cuts.defaults.relative_uln =
        settings.cuts.defaults.relative_uln || defaults.cuts.defaults.relative_uln;
    settings.cuts.defaults.relative_baseline =
        settings.cuts.defaults.relative_baseline || defaults.cuts.defaults.relative_baseline;

    // keep default cuts if user hasn't provided an alternative
    const cutMeasures = Object.keys(settings.cuts);
    Object.keys(defaults.cuts).forEach(function(m) {
        if (cutMeasures.indexOf(m) == -1) {
            settings.cuts[m] = defaults.cuts[m];
        }
    });

    return settings;
}
