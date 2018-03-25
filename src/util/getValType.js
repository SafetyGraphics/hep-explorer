export default function getValType(data, variable) {
    const values = d3.set(data.map(d => d[variable])).values();
    const numericValues = values.filter(value => +value || +value === 0);

    if (values.length === numericValues.length) return 'continuous';
    else return 'categorical';
}
