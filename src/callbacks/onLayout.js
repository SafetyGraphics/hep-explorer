import addRRatioSpan from './onLayout/addRRatioSpan';
import { initQuadrants } from './onLayout/initQuadrants';
import { initRugs } from './onLayout/initRugs';
import { initVisitPath } from './onLayout/initVisitPath';
import { initParticipantDetails } from './onLayout/initParticipantDetails';
import { initResetButton } from './onLayout/initResetButton';
import { initDisplayControl } from './onLayout/initDisplayControl';
import { layoutPanels } from './onLayout/layoutPanels';
import { initTitle } from './onLayout/initTitle';
import { init as initMessages } from './onLayout/messages/init';
import { initCustomWarning } from './onLayout/initCustomWarning';
import { initDroppedRowsWarning } from './onLayout/initDroppedRowsWarning';
import { initControlLabels } from './onLayout/initControlLabels';
import { addFootnote } from './onLayout/addFootnote';
import { addDownloadButton } from './onLayout/addDownloadButton';

export default function onLayout() {
    layoutPanels.call(this);

    //init messages section
    initMessages.call(this);
    initCustomWarning.call(this);
    initDroppedRowsWarning.call(this);

    initTitle.call(this);
    addDownloadButton.call(this);

    addFootnote.call(this);
    addRRatioSpan.call(this);
    initQuadrants.call(this);
    initRugs.call(this);
    initVisitPath.call(this);
    initParticipantDetails.call(this);
    initResetButton.call(this);
    initDisplayControl.call(this);
    initControlLabels.call(this);
}
