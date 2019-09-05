import { addBoxPlot } from './addBoxPlot';

export function init() {
    // Draw box plots
    this.svg.selectAll('g.yMargin').remove();
    this.svg.selectAll('g.xMargin').remove();

    // Y-axis box plot
    var yValues = this.current_data.map(function(d) {
        return d.values.y;
    });
    var ybox = this.svg.append('g').attr('class', 'yMargin');
    addBoxPlot(
        ybox,
        yValues,
        this.plot_height,
        1,
        this.y_dom,
        10,
        '#bbb',
        'white',
        '0.2f',
        true,
        this.config.y.type == 'log'
    );
    ybox.select('g.boxplot').attr(
        'transform',
        'translate(' + (this.plot_width + this.config.margin.right / 2) + ',0)'
    );

    //X-axis box plot
    var xValues = this.current_data.map(function(d) {
        return d.values.x;
    });
    var xbox = this.svg.append('g').attr('class', 'xMargin');
    addBoxPlot(
        xbox, //svg element
        xValues, //values
        1, //height
        this.plot_width, //width
        this.x_dom, //domain
        10, //box plot width
        '#bbb', //box color
        'white', //detail color
        '0.2f', //format
        false, // horizontal?
        this.config.y.type == 'log' // log?
    );
    xbox.select('g.boxplot').attr(
        'transform',
        'translate(0,' + -(this.config.margin.top / 2) + ')'
    );
}
