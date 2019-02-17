import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ContextMenuWrapper, addContextMenuEventListener} from 'react-context-menu-wrapper';
import {TriggerEvent} from '../TriggerEvent';
import {showContextMenu} from 'react-context-menu-wrapper';
import {ContextMenuType} from '../ContextMenuType';
import {ContextMenu} from '../../ui/context_menu/ContextMenu';
import Dropdown, {DropdownMenu, MenuItem} from "@trendmicro/react-dropdown";
import {ContextMenuMessages} from '../ContextMenuMessages';
import {AnnotationSidebarClient} from '../../annotation_sidebar/AnnotationSidebarClient';
import {BrowserContextMenu} from './BrowserContextMenu';

export class BrowserContextMenus {

    public static create() {

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

        showContextMenu({
            id: "viewer-context-menu",
            event: mouseEvent,
            data: triggerEvent,
            x: triggerEvent.point.x,
            y: triggerEvent.point.y
        });

    }

}

