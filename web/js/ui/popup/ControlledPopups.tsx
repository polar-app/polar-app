import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {Elements} from '../../util/Elements';
import {TriggerPopupEvent} from './TriggerPopupEvent';
import * as ReactDOM from 'react-dom';
import {ControlledPopup, ControlledPopupPlacement} from './ControlledPopup';
import * as React from 'react';

export class ControlledPopups {

    public static create(id: string,
                         placement: ControlledPopupPlacement,
                         title: string,
                         triggerPopupEventDispatcher: IEventDispatcher<TriggerPopupEvent>,
                         child: any) {

        const target = Elements.createElementHTML(`<div class="controlled-popup"></div>`);

        document.body.appendChild(target);

        ReactDOM.render(
            <ControlledPopup id={id}
                             placement={placement}
                             title={title}
                             triggerPopupEventDispatcher={triggerPopupEventDispatcher}>
                {child}
            </ControlledPopup>,
            target

        );

    }

}
