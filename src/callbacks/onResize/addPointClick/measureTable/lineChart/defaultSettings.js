export const defaultSettings = {
    max_width: 400,
    aspect: 4,
    x: {
        column: null,
        type: 'ordinal',
        label: 'Visit'
    },
    y: {
        column: 'absolute',
        type: 'linear',
        label: 'Lab Value',
        domain: [0, null],
        format: '.1f',
        domain: [0, null]
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
    margin: { top: 20 },
    gridlines: 'xy',
    colors: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628']
};
