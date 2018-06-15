export const defaultSettings = {
    max_width: 500,
    x: {
        column: null,
        type: 'ordinal',
        label: 'Visit'
    },
    y: {
        column: 'relative_uln',
        type: 'linear',
        label: 'Lab Value (x ULN)'
    },
    marks: [
        {
            type: 'line',
            per: []
        },
        {
            type: 'circle',
            per: []
        }
    ],
    color_by: null,
    aspect: 2
};
