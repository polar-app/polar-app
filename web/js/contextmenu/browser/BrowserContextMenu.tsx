import {ContextMenuWrapper, addContextMenuEventListener} from 'react-context-menu-wrapper';
import {TestMenu} from '../../../spectron/ui-components/TestMenu';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ContextMenu} from '../../ui/context_menu/ContextMenu';
import Dropdown, {DropdownMenu, MenuItem} from "@trendmicro/react-dropdown";
import {TriggerEvent} from '../TriggerEvent';
import {ContextMenuMessages} from '../ContextMenuMessages';

export class BrowserContextMenu {

    public static create() {

        const contextMenuRoot = document.createElement("div");
        contextMenuRoot.id = 'context-menu-root';

        document.body.appendChild(contextMenuRoot);

        const id = 'viewer-context-menu';

        let triggerEvent: TriggerEvent | null | undefined;

        addContextMenuEventListener(id, (eventName: string, data: TriggerEvent | null) => {
            console.log(`got event... ${eventName}`, data);
            triggerEvent = data;
        });

        ReactDOM.render(

            <ContextMenu id={id}>

                <DropdownMenu>

                    {/*<MenuItem header>Header</MenuItem>*/}
                    {/*<MenuItem eventKey={1}>link</MenuItem>*/}
                    {/*<MenuItem divider />*/}
                    {/*<MenuItem header>Header</MenuItem>*/}
                    {/*<MenuItem eventKey={2}>link</MenuItem>*/}
                    {/*<MenuItem eventKey={3} disabled>disabled</MenuItem>*/}
                    {/*<MenuItem eventKey={4} title="link with title">*/}
                        {/*link with title*/}
                    {/*</MenuItem>*/}

                    {/*<MenuItem eventKey={5}*/}
                              {/*active*/}
                              {/*onSelect={(eventKey: number) => {*/}
                                  {/*alert(`Alert from menu item.\neventKey: ${eventKey}`);*/}
                              {/*}}>*/}
                        {/*link that alerts*/}
                    {/*</MenuItem>*/}

                    <MenuItem onSelect={() => ContextMenuMessages.postContextMenuMessage("create-pagemark-to-point", triggerEvent!)}>

                        Create Pagemark to Point

                    </MenuItem>

                </DropdownMenu>

            </ContextMenu>,

            contextMenuRoot

        );

    }

}
