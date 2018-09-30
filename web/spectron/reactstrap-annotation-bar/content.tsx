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
import {CommentPopupBars} from '../../js/comments/react/CommentPopupBars';
import {CommentPopupBarCallbacks} from '../../js/comments/react/CommentPopupBar';
import {CommentCreatedEvent} from '../../js/comments/react/CommentPopupBoxes';

SpectronRenderer.run(async () => {

    ReactDOM.render(
        <App />,
        document.getElementById('root') as HTMLElement
    );

    const commentBarControlledPopupProps: ControlledPopupProps = {
        id: 'commentbar',
        placement: 'bottom',
        triggerPopupEventDispatcher: new SimpleReactor<TriggerPopupEvent>()
    };

    const commentPopupBarCallbacks: CommentPopupBarCallbacks = {

        onComment: (commentCreatedEvent: CommentCreatedEvent) => {
            console.log("FIXME: comment created", commentCreatedEvent);
        }

    };

    CommentPopupBars.create(commentBarControlledPopupProps, commentPopupBarCallbacks);

    // FIXME: just tie the visibility of the popup to the visiblity of the
    // region.. when the region vanishes then just close the popup OR the text
    // area is close obviously.

    const triggerPopupEventDispatcher = new SimpleReactor<TriggerPopupEvent>();

    const annotationBarControlledPopupProps: ControlledPopupProps = {
        id: 'annotationbar',
        placement: 'top',
        triggerPopupEventDispatcher
    };

    function onComment(activeSelection: ActiveSelectionEvent) {

        // create the new popup BELOW the region now...
        console.log("Got comment button clicked");

        commentBarControlledPopupProps.triggerPopupEventDispatcher.dispatchEvent({
            point: {
                x: activeSelection.boundingClientRect.left + (activeSelection.boundingClientRect.width / 2),
                y: activeSelection.boundingClientRect.bottom
            },
            offset: {
                x: 0,
                y: 10
            }
        });

    }

    const annotationBarCallbacks: AnnotationBarCallbacks = {
        onComment
    };

    AnnotationBars.create(annotationBarControlledPopupProps, annotationBarCallbacks);

});






