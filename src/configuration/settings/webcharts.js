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
                summarizeY: 'mean',
                summarizeX: 'mean',
                attributes: { 'fill-opacity': 0 }
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
