import { makeNestedData } from './makeNestedData';
import { addSparkLines } from './sparkLine/addSparkLines';
import { addSparkClick } from './sparkLine/addSparkClick';
import { addFootnote } from './addFootnote';
export function drawMeasureTable(d) {
    var nested = makeNestedData.call(this, d);

    //draw the measure table
    this.participantDetails.wrap.selectAll('*').style('display', null);
    this.measureTable.on('draw', function() {
        addFootnote.call(this);
        addSparkLines.call(this);
        addSparkClick.call(this);
    });
    this.measureTable.draw(nested);
}
