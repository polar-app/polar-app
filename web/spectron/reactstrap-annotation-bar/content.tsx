import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import App from './App';
import {ActiveSelectionEvent} from '../../js/ui/popup/ActiveSelections';
import {AnnotationBars} from './AnnotationBars';
import {TriggerPopupEvent} from '../../js/ui/popup/TriggerPopupEvent';
import {SimpleReactor} from '../../js/reactor/SimpleReactor';
import {AnnotationBarCallbacks} from './AnnotationBar';
import {ControlledPopupProps} from '../../js/ui/popup/ControlledPopup';

function onComment(activeSelection: ActiveSelectionEvent) {

    // create the new popup BELOW the region now...
    console.log("Got comment");

}

SpectronRenderer.run(async () => {

    ReactDOM.render(
        <App />,
        document.getElementById('root') as HTMLElement
    );

    // FIXME: just tie the visibility of the popup to the visiblity of the
    // region.. when the region vanishes then just close the popup OR the text
    // area is close obviously.

    const triggerPopupEventDispatcher = new SimpleReactor<TriggerPopupEvent>();

    const controlledPopupProps: ControlledPopupProps = {
        id: 'annotationbar',
        title: 'Add Comment',
        placement: 'top',
        triggerPopupEventDispatcher
    };

    const annotationBarCallbacks: AnnotationBarCallbacks = {
        onComment
    };

    AnnotationBars.create(controlledPopupProps, annotationBarCallbacks);

});






