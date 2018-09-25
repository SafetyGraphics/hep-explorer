export const defaultSettings = {
    max_width: 800,
    aspect: 4,
    x: {
        column: 'visitn',
        type: 'ordinal',
        label: 'Visit'
    },
    y: {
        column: 'value',
        type: 'linear',
        label: '',
        //    domain: [0, null],
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
            },
            tooltip: 'Visit: [visitn]\nValue: [value]\nULN: [uln]\nLLN: [lln]'
        }
    ],
    margin: { top: 20 },
    gridlines: 'x',
    colors: ['black']
};
