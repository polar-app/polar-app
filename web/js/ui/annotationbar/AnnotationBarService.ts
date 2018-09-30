import {DocumentLoadedEvent, Model} from '../../model/Model';
import {Logger} from '../../logger/Logger';
import {ControlledPopupProps} from '../popup/ControlledPopup';
import {SimpleReactor} from '../../reactor/SimpleReactor';
import {TriggerPopupEvent} from '../popup/TriggerPopupEvent';
import {CommentPopupBarCallbacks} from '../../comments/react/CommentPopupBar';
import {CommentCreatedEvent} from '../../comments/react/CommentCreatedEvent';
import {CommentPopupBars} from '../../comments/react/CommentPopupBars';
import {AnnotationBarCallbacks, CommentTriggerEvent, OnCommentCallback, OnHighlightedCallback} from './AnnotationBar';
import {HighlightCreatedEvent} from '../../comments/react/HighlightCreatedEvent';
import {AnnotationBars} from './AnnotationBars';

const log = Logger.create();

export class AnnotationBarService {

    private model: Model;

    constructor(model: Model) {
        this.model = model;
    }

    public start(): void {
        this.model.registerListenerForDocumentLoaded(event => this.onDocumentLoaded(event));

    }

    private onDocumentLoaded(event: DocumentLoadedEvent) {
        log.debug("Creating annotation bar");

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

        const onComment: OnCommentCallback =
            (commentTriggerEvent: CommentTriggerEvent) => {

                // create the new popup BELOW the region now...
                console.log("Got comment button clicked");

                const activeSelection = commentTriggerEvent.activeSelection;

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

            };

        const onHighlighted: OnHighlightedCallback = (highlightCreatedEvent: HighlightCreatedEvent) => {

            console.log("Got highlight!", highlightCreatedEvent);

        };

        const annotationBarCallbacks: AnnotationBarCallbacks = {
            onHighlighted,
            onComment
        };

        AnnotationBars.create(annotationBarControlledPopupProps, annotationBarCallbacks, 1);


    }

}
