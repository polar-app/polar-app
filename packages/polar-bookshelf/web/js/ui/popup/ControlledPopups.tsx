import {Elements} from '../../util/Elements';
import * as ReactDOM from 'react-dom';
import {ControlledPopup, ControlledPopupProps} from './ControlledPopup';
import * as React from 'react';

export class ControlledPopups {

    public static create(controlledPopupProps: ControlledPopupProps,
                         child: any) {

        const target = Elements.createElementHTML(`<div class="controlled-popup"></div>`);

        document.body.appendChild(target);

        ReactDOM.render(
            <ControlledPopup popupStateEventDispatcher={controlledPopupProps.popupStateEventDispatcher}
                             id={controlledPopupProps.id}
                             placement={controlledPopupProps.placement}
                             triggerPopupEventDispatcher={controlledPopupProps.triggerPopupEventDispatcher}>
                {child}
            </ControlledPopup>,
            target

        );

    }

}
