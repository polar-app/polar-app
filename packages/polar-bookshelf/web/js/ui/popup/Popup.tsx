import Popper from 'popper.js';
import {MouseEventReferenceObject} from './MouseEventReferenceObject';
import {IPoint} from '../../Point';
import {PointReferenceObject} from './PointReferenceObject';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {CommentInputEvent} from '../../comments/react/CommentInputEvent';
import * as ReactDOM from 'react-dom';
import {CommentPopupBox} from '../../comments/react/CommentPopupBox';
import * as React from 'react';
import {OnCommentHandler} from '../../comments/react/CommentPopupBoxes';
import {TriggerPopupEvent} from './TriggerPopupEvent';
import {ControlledPopup} from './ControlledPopup';

export class Popup {

    // TODO: automatically hide the popper if they click outside
    // of the UI as an option.

    public static createAtPoint(point: IPoint,
                                placement: Popper.Placement,
                                popupElement: HTMLElement): PopupInstance {


        const referenceObject = new PointReferenceObject(point.x, point.y);
        return new Popper(referenceObject, popupElement , {

            placement,
            onCreate: (data) => {
                this.showElement(popupElement);
            },
            modifiers: {
            }

        });

    }

    public static createAtSelection(mouseEvent: MouseEvent,
                                    range: Range,
                                    mouseDirection: MouseDirection,
                                    placement: Popper.Placement,
                                    popupElement: HTMLElement): PopupInstance {

        const referenceObject = new MouseEventReferenceObject(mouseEvent, range, mouseDirection);
        return new Popper(referenceObject, popupElement , {

            placement,
            onCreate: (data) => {
                this.showElement(popupElement);
            },
            modifiers: {

            }

        });

    }


    private static showElement(element: HTMLElement) {

        // mimics jquery popup.show() without jquery

        // TODO: restore what it was before it was hidden.
        element.style.display = 'block';

    }

}

export interface PopupInstance {
    destroy(): void;
}

/**
 * The direction the mouse is moving.
 */
export type MouseDirection = 'up' | 'down';

