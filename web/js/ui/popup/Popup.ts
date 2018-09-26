import Popper from 'popper.js';
import {MouseEventReferenceObject} from './MouseEventReferenceObject';

export class Popup {

    public static createAtPoint() {

    }

    public static createAtSelection(mouseEvent: MouseEvent,
                                    range: Range,
                                    mouseDirection: MouseDirection,
                                    placement: Popper.Placement,
                                    popupElement: HTMLElement) {

        const referenceObject = new MouseEventReferenceObject(mouseEvent, range, mouseDirection);
        const popper = new Popper(referenceObject, popupElement , {

            placement,
            onCreate: (data) => {
                // popup.show();
                // TODO: restore what it was before it was hidden.
                popupElement.style.display = 'block';
                // TODO: automatically hide the popper if they click outside of the UI.
            },
            modifiers: {
                // flip: {
                //     behavior: ['left', 'right', 'top', 'bottom']
                // },
                // offset: {
                //     enabled: true,
                //     offset: '10,0'
                // }
                // arrow: {
                //     enabled: true
                // }
            }

        });

    }

}

/**
 * The direction the mouse is moving.
 */
export type MouseDirection = 'up' | 'down';
