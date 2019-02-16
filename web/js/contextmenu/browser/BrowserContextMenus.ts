import {TriggerEvent} from '../TriggerEvent';
import {showContextMenu} from 'react-context-menu-wrapper';

export class BrowserContextMenus {

    public static trigger(triggerEvent: TriggerEvent, mouseEvent: MouseEvent) {

        showContextMenu({
            id: "viewer-context-menu",
            event: mouseEvent,
            data: triggerEvent,
            x: triggerEvent.point.x,
            y: triggerEvent.point.y
        });

    }

}
