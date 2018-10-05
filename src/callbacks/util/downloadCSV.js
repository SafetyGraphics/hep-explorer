import { time } from 'd3';

export function downloadCSV(data) {
    const CSVarray = [];

    //add headers to CSV array
    const headers = Object.keys(data[0]).map(header => `"${header.replace(/"/g, '""')}"`);
    CSVarray.push(headers);

    //add rows to CSV array
    data.forEach((d, i) => {
        const row = Object.keys(data[0]).map(col => {
            let value = d[col];

            if (typeof value === 'string') value = value.replace(/"/g, '""');

            return `"${value}"`;
        });

        CSVarray.push(row);
    });

    //transform blob array into a blob of characters
    const blob = new Blob([CSVarray.join('\n')], {
        type: 'text/csv;charset=utf-8;'
    });

    const fileName = `eDishDroppedRows_${time.format('%Y-%m-%dT%H-%M-%S')(new Date())}.csv`;
    const link = d3.select(this);

    if (navigator.msSaveBlob)
        //IE
        navigator.msSaveBlob(blob, fileName);
    else if (link.node().download !== undefined) {
        //21st century browsers
        var url = URL.createObjectURL(blob);
        link.node().setAttribute('href', url);
        link.node().setAttribute('download', fileName);
    }
}
