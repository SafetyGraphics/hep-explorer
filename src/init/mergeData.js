export default function mergeData(lb,ex) {
    lb.forEach(d => {
        d.se_domain = 'lb';
    });
    ex.forEach(d => {
        d.se_domain = 'ex';
    });

    return [...lb, ...ex];
}
