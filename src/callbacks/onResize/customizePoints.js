import { addPointMouseover } from './customizePoints/addPointMouseover';
import { addPointClick } from './customizePoints/addPointClick';
import { addPointTitles } from './customizePoints/addPointTitles';
import { formatPoints } from './customizePoints/formatPoints';
import { setPointSize } from './customizePoints/setPointSize';
import { setPointOpacity } from './customizePoints/setPointOpacity';
import { updateParticipantMarks } from './customizePoints/updateParticipantMarks';

export default function customizePoints() {
    addPointMouseover.call(this);
    addPointClick.call(this);
    addPointTitles.call(this);
    formatPoints.call(this);
    setPointSize.call(this);
    setPointOpacity.call(this);
    updateParticipantMarks.call(this);
}
