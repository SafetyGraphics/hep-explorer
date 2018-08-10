export default function setCutpointMinimums() {
    const chart = this;

    this.controls.wrap
        .selectAll('.control-group')
        .filter(d => /.-axis cut/i.test(d.description))
        .attr('min', 0)
        .on('change', function(d) {
            const input = d3.select(this).select('input');

            //Prevent a negative input.
            if (input.property('value') < 0) input.property('value', 0);

            //Update chart setting.
            chart.config.quadrants.cut_data[
                d.description.split('-')[0].toLowerCase()
            ] = input.property('value');

            //Redraw.
            chart.draw();
        });
}
