export const defaultSettings = {
    max_width: 800,
    aspect: 4,
    x: {
        column: 'studyday',
        type: 'linear',
        label: 'Study Day'
    },
    y: {
        column: 'value',
        type: 'linear',
        label: '',
        format: '.1f'
    },
    marks: [
        {
            type: 'line',
            per: ['lab']
        },
        {
            type: 'circle',
            radius: 4,
            per: ['lab', 'studyday'],
            values: { outlier: [true] },
            attributes: {
                'fill-opacity': 1
            }
        }
    ],
    margin: { top: 20 },
    gridlines: 'x',
    colors: []
};
