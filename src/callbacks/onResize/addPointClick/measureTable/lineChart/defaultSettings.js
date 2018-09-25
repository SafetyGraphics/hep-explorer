export const defaultSettings = {
    max_width: 400,
    aspect: 4,
    x: {
        column: 'visitn',
        type: 'ordinal',
        label: 'Visit'
    },
    y: {
        column: 'value',
        type: 'linear',
        label: 'Lab Value',
        domain: [0, null],
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
            per: ['lab', 'visitn'],
            values: { outlier: [true] },
            attributes: {
                stroke: 'orange',
                fill: 'orange',
                'fill-opacity': 1
            }
        }
    ],
    margin: { top: 20 },
    gridlines: 'x',
    colors: ['black']
};
