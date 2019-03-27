import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {showContextMenu} from '@burtonator/react-context-menu-wrapper';
import {TriggerEvent} from '../TriggerEvent';
import {DropdownMenu, MenuItem} from "@burtonator/react-dropdown";
import {BrowserContextMenu} from './BrowserContextMenu';

export class BrowserContextMenus {

    public static create() {

        ClientPositionListener.start();

        const contextMenuRoot = document.createElement("div");
        contextMenuRoot.id = 'context-menu-root';

        document.body.appendChild(contextMenuRoot);

        const id = 'viewer-context-menu';

        ReactDOM.render(

            <BrowserContextMenu id={id}>

            </BrowserContextMenu>,

            contextMenuRoot

        );

    }

    public static trigger(triggerEvent: TriggerEvent, mouseEvent: MouseEvent) {

        const position = ClientPositionListener.get();

        showContextMenu({
            id: "viewer-context-menu",
            event: mouseEvent,
            data: triggerEvent,
            x: position.x,
            y: position.y
        });

    }

}

class ClientPositionListener {

    private static position = {
        x: 0,
        y: 0
    };

    public static start() {

        const div = document.createElement("div");

        div.style.position = 'fixed';
        div.style.left = '0';
        div.style.top = '0';
        div.style.width = '100vh';
        div.style.height = '100vh';
        div.style.backgroundColor = 'transparent';
        div.style.zIndex = '999999';

        div.addEventListener('mousemove', event => {
            this.position.x = event.clientX;
            this.position.y = event.clientY;
        });

    }

    public static get(): ClientPosition {
        return this.position;
    }

}

export interface ClientPosition {
    readonly x: number;
    readonly y: number;
}
