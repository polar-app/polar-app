import * as React from 'react';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {TriggerPopupEvent} from './TriggerPopupEvent';
import {PopupStateEvent} from './PopupStateEvent';

export interface ControlledPopupProps {

    readonly id: string;

    readonly placement: ControlledPopupPlacement;

    readonly popupStateEventDispatcher: IEventDispatcher<PopupStateEvent>;

    readonly triggerPopupEventDispatcher: IEventDispatcher<TriggerPopupEvent>;

}

export type ControlledPopupPlacement = 'top' | 'bottom';
