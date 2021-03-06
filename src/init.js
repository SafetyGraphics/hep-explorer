import mergeData from './init/mergeData';

export default function init(lb = [], ex = []) {
    //const data = mergeData(lb,ex);
    this.data = {
        lb,
        ex
    };
    this.chart.exposure = {
        include: Array.isArray(ex) && ex.length,
        data: ex
    };
    this.chart.init(lb);
}
