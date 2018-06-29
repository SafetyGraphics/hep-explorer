export const defaultSettings = {
    max_width: 600,
    x: {
        column: null,
        type: 'ordinal',
        label: 'Visit'
    },
    y: {
        column: 'relative_uln',
        type: 'linear',
        label: 'Lab Value (x ULN)',
        domain: null,
        format: '.1f'
    },
    marks: [
        {
            type: 'line',
            per: []
        },
        {
            type: 'circle',
            radius: 4,
            per: []
        }
    ],
    color_by: null,
    colors: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628'],
    aspect: 2
};
