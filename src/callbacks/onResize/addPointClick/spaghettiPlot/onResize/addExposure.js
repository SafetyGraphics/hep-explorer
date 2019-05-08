export default function addExposure() {
    const context = this;
    this.svg.select('.se-exposure-supergroup').remove();

    //If exposure data exists, annotate exposures beneath x-axis.
    if (this.edish.exposure.include) {
        const supergroup = this.svg
            .insert('g', '.supergroup')
            .classed('se-exposure-supergroup', true);
        const dy = 20; // offset from chart
        const strokeWidth = 5; // width/diameter of marks
        this.svg.selectAll('.x.axis .tick text').attr('dy', `${dy + strokeWidth * 3}px`); // offset x-axis tick labels

        //top boundary line
        supergroup.append('line').attr({
            x1: -this.margin.left,
            y1: this.plot_height + dy - strokeWidth * 2,
            x2: this.plot_width,
            y2: this.plot_height + dy - strokeWidth * 2,
            stroke: 'black',
            'stroke-opacity': 0.1
        });

        //Exposure text
        supergroup
            .append('text')
            .attr({
                x: -3,
                y: this.plot_height + dy + strokeWidth,
                'text-anchor': 'end',
                textLength: this.margin.left - 3
            })
            .text('Exposure');

        //bottom boundary line
        supergroup.append('line').attr({
            x1: -this.margin.left,
            y1: this.plot_height + dy + strokeWidth * 2,
            x2: this.plot_width,
            y2: this.plot_height + dy + strokeWidth * 2,
            stroke: 'black',
            'stroke-opacity': 0.1
        });

        //Exposures
        const groups = supergroup
            .selectAll('g.se-exposure-group')
            .data(this.exposure_data)
            .enter()
            .append('g')
            .classed('se-exposure-group', true);
        groups.each(function(d) {
            const group = d3.select(this);

            //draw a line if exposure start and end dates are unequal
            if (
                d[context.edish.config.exposure_stdy_col] !==
                d[context.edish.config.exposure_endy_col]
            ) {
                group
                    .append('line')
                    .classed('se-exposure-line', true)
                    .attr({
                        x1: d => context.x(+d[context.edish.config.exposure_stdy_col]),
                        y1: context.plot_height + dy,
                        x2: d => context.x(+d[context.edish.config.exposure_endy_col]),
                        y2: context.plot_height + dy,
                        stroke: 'black',
                        'stroke-width': strokeWidth,
                        'stroke-opacity': 0.25
                    })
                    .on('mouseover', function(d) {
                        this.setAttribute('stroke-width', strokeWidth * 2);

                        //annotate a rectangle in the chart
                        group
                            .append('rect')
                            .classed('se-exposure-highlight', true)
                            .attr({
                                x: d => context.x(+d[context.edish.config.exposure_stdy_col]),
                                y: 0,
                                width: d =>
                                    context.x(+d[context.edish.config.exposure_endy_col]) -
                                    context.x(+d[context.edish.config.exposure_stdy_col]),
                                height: context.plot_height,
                                fill: 'black',
                                'fill-opacity': 0.25
                            });
                    })
                    .on('mouseout', function(d) {
                        this.setAttribute('stroke-width', strokeWidth);

                        //remove rectangle from the chart
                        group.select('.se-exposure-highlight').remove();
                    })
                    .append('title')
                    .text(
                        `Study Day: ${d[context.edish.config.exposure_stdy_col]}-${
                            d[context.edish.config.exposure_endy_col]
                        } (${+d[context.edish.config.exposure_endy_col] -
                            +d[context.edish.config.exposure_stdy_col] +
                            (+d[context.edish.config.exposure_endy_col] >=
                                +d[context.edish.config.exposure_stdy_col])} days)\nTreatment: ${
                            d[context.edish.config.exposure_trt_col]
                        }\nDose: ${d[context.edish.config.exposure_dose_col]} ${
                            d[context.edish.config.exposure_dosu_col]
                        }`
                    );
            }
            //draw a circle if exposure start and end dates are equal
            else {
                group
                    .append('circle')
                    .classed('se-exposure-circle', true)
                    .attr({
                        cx: d => context.x(+d[context.edish.config.exposure_stdy_col]),
                        cy: context.plot_height + dy,
                        r: strokeWidth / 2,
                        fill: 'black',
                        'fill-opacity': 0.25,
                        stroke: 'black',
                        'stroke-opacity': 1
                    })
                    .on('mouseover', function(d) {
                        this.setAttribute('r', strokeWidth);

                        //annotate a vertical line in the chart
                        group
                            .append('line')
                            .classed('se-exposure-highlight', true)
                            .attr({
                                x1: context.x(+d[context.edish.config.exposure_stdy_col]),
                                y1: 0,
                                x2: context.x(+d[context.edish.config.exposure_stdy_col]),
                                y2: context.plot_height,
                                stroke: 'black',
                                'stroke-width': 1,
                                'stroke-opacity': 0.5,
                                'stroke-dasharray': '3 1'
                            });
                    })
                    .on('mouseout', function(d) {
                        this.setAttribute('r', strokeWidth / 2);

                        //remove vertical line from the chart
                        group.select('.se-exposure-highlight').remove();
                    })
                    .append('title')
                    .text(
                        `Study Day: ${d[context.edish.config.exposure_stdy_col]}\nTreatment: ${
                            d[context.edish.config.exposure_trt_col]
                        }\nDose: ${d[context.edish.config.exposure_dose_col]} ${
                            d[context.edish.config.exposure_dosu_col]
                        }`
                    );
            }
        });
    }
}
