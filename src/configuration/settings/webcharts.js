export default function webcharts() {
    return {
        x: {
            column: null, //set in onPreprocess/updateAxisSettings
            label: null, // set in onPreprocess/updateAxisSettings,
            type: 'linear',
            behavior: 'raw',
            format: '.2f'
            //domain: [0, null]
        },
        y: {
            column: null, // set in onPreprocess/updateAxisSettings,
            label: null, // set in onPreprocess/updateAxisSettings,
            type: 'linear',
            behavior: 'raw',
            format: '.2f'
            //domain: [0, null]
        },
        marks: [
            {
                per: [], // set in syncSettings()
                type: 'circle',
                summarizeX: 'mean',
                summarizeY: 'mean',
                attributes: {
                    'fill-opacity': 0,
                    'stroke-width': 1.5
                }
            },
            {
                per: [], // set in syncSettings()
                type: 'circle',
                summarizeX: 'mean',
                summarizeY: 'mean',
                attributes: {
                    'fill-opacity': 0.1,
                    'stroke-width': 0.5
                },
                radius: 1
            }
        ],
        gridlines: 'xy',
        color_by: null, //set in syncSettings
        max_width: 600,
        aspect: 1,
        legend: { location: 'top' },
        margin: { right: 25, top: 25, bottom: 75 }
    };
}
