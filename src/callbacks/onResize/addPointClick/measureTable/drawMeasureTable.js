import { makeNestedData } from './makeNestedData';
import { addSparkLines } from './sparkLine/addSparkLines';
import { addSparkClick } from './sparkLine/addSparkClick';
import { addFootnote } from './addFootnote';
export function drawMeasureTable(d) {
    var nested = makeNestedData.call(this, d);

    //draw the measure table
    this.measureTable.on('draw', function() {
        addSparkLines.call(this);
        addSparkClick.call(this);
        addFootnote.call(this);
    });
    this.measureTable.draw(nested);
}
