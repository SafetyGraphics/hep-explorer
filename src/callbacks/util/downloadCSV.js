export function downloadCSV(data, cols, file) {
    const CSVarray = [];

    //add headers to CSV array
    var cols = cols ? cols : Object.keys(data[0]);
    const headers = cols.map(header => `"${header.replace(/"/g, '""')}"`);
    CSVarray.push(headers);
    //add rows to CSV array
    data.forEach((d, i) => {
        const row = cols.map(col => {
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
    const fileCore = file ? file : 'eDish';
    const fileName = `${fileCore}_${d3.time.format('%Y-%m-%dT%H-%M-%S')(new Date())}.csv`;
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
