import { initQuadrants } from './onLayout/initQuadrants';
import { initRugs } from './onLayout/initRugs';
import { initVisitPath } from './onLayout/initVisitPath';
import { initParticipantDetails } from './onLayout/initParticipantDetails';
import { initResetButton } from './onLayout/initResetButton';
import { initDisplayControlLabels } from './onLayout/initDisplayControlLabels';

export default function onLayout() {
    initQuadrants.call(this);
    initRugs.call(this);
    initVisitPath.call(this);
    initParticipantDetails.call(this);
    initResetButton.call(this);
    initDisplayControlLabels.call(this);
}
