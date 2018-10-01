import {AnnotationBar, AnnotationBarCallbacks, AnnotationBarTriggerEvent} from './AnnotationBar';
import * as React from 'react';
import {ControlledPopups} from '../popup/ControlledPopups';
import {ActiveSelections} from '../popup/ActiveSelections';
import {IEventDispatcher, SimpleReactor} from '../../reactor/SimpleReactor';
import {ControlledPopupProps} from '../popup/ControlledPopup';

export class AnnotationBars {

    public static create(controlledPopupProps: ControlledPopupProps,
                         annotationBarCallbacks: AnnotationBarCallbacks,
                         pageNum: number) {

        const annotationBarTriggerEventDispatcher = new SimpleReactor<AnnotationBarTriggerEvent>();

        const child = <AnnotationBar annotationBarTriggerEventDispatcher={annotationBarTriggerEventDispatcher}
                                     onHighlighted={annotationBarCallbacks.onHighlighted}
                                     onComment={annotationBarCallbacks.onComment}/>;

        ControlledPopups.create(controlledPopupProps, child);

        const selectionTargets = this.getSelectionTargets();

        this.registerEventListener(controlledPopupProps, pageNum, annotationBarTriggerEventDispatcher, document.body);

        //
        // for (const target of selectionTargets) {
        //     console.log("FIXME: registering for selection target: ", target)
        //     this.registerEventListener(controlledPopupProps, pageNum, annotationBarTriggerEventDispatcher, target);
        // }

    }

    private static registerEventListener(controlledPopupProps: ControlledPopupProps,
                                         pageNum: number,
                                         annotationBarTriggerEventDispatcher: IEventDispatcher<AnnotationBarTriggerEvent>,
                                         target: HTMLElement) {

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

        }, target);
    }


    private static getSelectionTargets(): HTMLElement[] {

        const result: HTMLElement[] = [];

        result.push(...Array.from(document.body.querySelectorAll(".page")) as HTMLElement[]);

        // FIXME: find all iframes recursivelly...

        const iframes: HTMLIFrameElement[]
            = Array.from(document.body.querySelectorAll("iframe"));

        for (const iframe of iframes) {
            result.push(iframe.contentDocument!.body);
        }

        return result;

    }

}
