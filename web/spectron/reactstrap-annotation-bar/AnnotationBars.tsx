import {AnnotationBar, AnnotationBarCallbacks} from './AnnotationBar';
import * as React from 'react';
import {ControlledPopups} from '../../js/ui/popup/ControlledPopups';
import {ActiveSelectionEvent, ActiveSelections} from '../../js/ui/popup/ActiveSelections';
import {SimpleReactor} from '../../js/reactor/SimpleReactor';
import {ControlledPopupProps} from '../../js/ui/popup/ControlledPopup';

export class AnnotationBars {

    public static create(controlledPopupProps: ControlledPopupProps,
                         annotationBarCallbacks: AnnotationBarCallbacks) {

        const activeSelectionEventDispatcher = new SimpleReactor<ActiveSelectionEvent>();

        const child = <AnnotationBar activeSelectionEventDispatcher={activeSelectionEventDispatcher}
                                     onComment={annotationBarCallbacks.onComment}>

        </AnnotationBar>;

        ControlledPopups.create(controlledPopupProps, child);

        ActiveSelections.addEventListener(event => {

            controlledPopupProps.triggerPopupEventDispatcher.dispatchEvent({
                point: {
                    x: event.boundingClientRect.left + (event.boundingClientRect.width / 2),
                    y: event.boundingClientRect.top
                },
                offset: {
                    x: 0,
                    y: -10
                }
            });

            activeSelectionEventDispatcher.dispatchEvent(event);

        });

    }

}
