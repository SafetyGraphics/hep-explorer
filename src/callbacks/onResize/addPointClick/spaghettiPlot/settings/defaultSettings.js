export const defaultSettings = {
    max_width: 600,
    x: {
        column: null,
        type: 'linear',
        label: 'Study Day'
    },
    y: {
        column: 'relative_uln',
        type: 'linear',
        label: null, // set in ../callbacks/onPreprocess
        domain: null,
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
    margin: { top: 20, bottom: 70 }, // bottom margin provides space for exposure plot
    gridlines: 'xy',
    color_by: null,
    colors: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628'],
    aspect: 2
};
