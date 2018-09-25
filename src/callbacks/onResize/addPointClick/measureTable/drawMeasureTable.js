import { makeNestedData } from './makeNestedData';
import { addSparkLines } from './sparkLine/addSparkLines';
import { addSparkClick } from './sparkLine/addSparkClick';

export function drawMeasureTable(d) {
    var nested = makeNestedData.call(this, d);

    //draw the measure table
    this.participantDetails.wrap.selectAll('*').style('display', null);
    this.measureTable.on('draw', function() {
        addSparkLines.call(this);
        addSparkClick.call(this);
    });
    this.measureTable.draw(nested);
}
