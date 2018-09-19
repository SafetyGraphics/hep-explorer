export default function onDraw() {
    var spaghetti = this;
    var eDish = this.parent;

    //calculate the y domain
    spaghetti.config.y.domain = d3.extent(eDish.imputed_data, f => f[spaghetti.config.y.column]);
    spaghetti.y_dom = spaghetti.config.y.domain;
}
