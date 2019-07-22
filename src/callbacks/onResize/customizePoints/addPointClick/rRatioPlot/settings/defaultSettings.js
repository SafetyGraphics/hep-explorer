export const defaultSettings = {
    max_width: 600,
    x: {
        column: 'day',
        type: 'linear',
        label: 'Study Day'
    },
    y: {
        column: 'rRatio',
        type: 'linear',
        label: 'R Ratio  [(ALT/ULN) / (ALP/ULN)]',
        format: '.1f',
        domain: [0, null]
    },
    marks: [
        {
            type: 'line',
            per: ['id']
        },
        {
            type: 'circle',
            radius: 4,
            per: ['id', 'day']
        }
    ],
    margin: { top: 20 },
    gridlines: 'xy',
    aspect: 2
};
