import {AnnotationBar, AnnotationBarCallbacks, AnnotationBarTriggerEvent} from './AnnotationBar';
import * as React from 'react';
import {ControlledPopups} from '../../js/ui/popup/ControlledPopups';
import {ActiveSelections} from '../../js/ui/popup/ActiveSelections';
import {SimpleReactor} from '../../js/reactor/SimpleReactor';
import {ControlledPopupProps} from '../../js/ui/popup/ControlledPopup';

export class AnnotationBars {

    public static create(controlledPopupProps: ControlledPopupProps,
                         annotationBarCallbacks: AnnotationBarCallbacks,
                         pageNum: number) {

        const annotationBarTriggerEventDispatcher = new SimpleReactor<AnnotationBarTriggerEvent>();

        const child = <AnnotationBar annotationBarTriggerEventDispatcher={annotationBarTriggerEventDispatcher}
                                     onHighlighted={annotationBarCallbacks.onHighlighted}
                                     onComment={annotationBarCallbacks.onComment}/>;

        ControlledPopups.create(controlledPopupProps, child);

        ActiveSelections.addEventListener(activeSelectionEvent => {

            // this causes the popup to display
            controlledPopupProps.triggerPopupEventDispatcher.dispatchEvent({
                point: {
                    x: activeSelectionEvent.boundingClientRect.left + (activeSelectionEvent.boundingClientRect.width / 2),
                    y: activeSelectionEvent.boundingClientRect.top
                },
                offset: {
                    x: 0,
                    y: -10
                }
            });

            // this gives the information to our annotation bar.
            const annotationBarTriggerEvent: AnnotationBarTriggerEvent = {
                activeSelection: activeSelectionEvent,
                type: 'range',
                pageNum
            };

            annotationBarTriggerEventDispatcher.dispatchEvent(annotationBarTriggerEvent);

        });

    }

}
