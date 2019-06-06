import { addPointMouseover } from './customizeMaxPoints/addPointMouseover';
import { addPointClick } from './customizeMaxPoints/addPointClick';
import { addPointTitles } from './customizeMaxPoints/addPointTitles';
import { formatPoints } from './customizeMaxPoints/formatPoints';
import { setPointSize } from './customizeMaxPoints/setPointSize';
import { setPointOpacity } from './customizeMaxPoints/setPointOpacity';
import { updateParticipantMarks } from './customizeMaxPoints/updateParticipantMarks';

export default function customizeMaxPoints() {
    addPointMouseover.call(this);
    addPointClick.call(this);
    addPointTitles.call(this);
    formatPoints.call(this);
    setPointSize.call(this);
    setPointOpacity.call(this);
    updateParticipantMarks.call(this);
}
