import {ContextMenuWrapper, addContextMenuEventListener} from 'react-context-menu-wrapper';
import {TestMenu} from '../../../spectron/ui-components/TestMenu';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ContextMenu} from '../../ui/context_menu/ContextMenu';
import Dropdown, {DropdownMenu, MenuItem} from "@trendmicro/react-dropdown";
import {TriggerEvent} from '../TriggerEvent';
import {ContextMenuMessages} from '../ContextMenuMessages';
import {ContextMenuType} from '../ContextMenuType';
import {AnnotationSidebarClient} from '../../annotation_sidebar/AnnotationSidebarClient';

export class BrowserContextMenu extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {

            selectionContexts: {
                page: false,
                areaHighlight: false,
                textHighlight: false,
                pagemark: false
            }

        };

        const id = this.props.id;

        addContextMenuEventListener(id, (eventName: string, data: TriggerEvent | null) => {

            const triggerEvent: TriggerEvent = data!;

            const state = {...this.state, triggerEvent};

            if (triggerEvent) {

                state.selectionContexts.page = triggerEvent.contextMenuTypes.includes(ContextMenuType.PAGE);
                state.selectionContexts.textHighlight = triggerEvent.contextMenuTypes.includes(ContextMenuType.TEXT_HIGHLIGHT);
                state.selectionContexts.areaHighlight = triggerEvent.contextMenuTypes.includes(ContextMenuType.AREA_HIGHLIGHT);
                state.selectionContexts.pagemark = triggerEvent.contextMenuTypes.includes(ContextMenuType.PAGEMARK);
            }


            console.log(`FIXME: got event... ${eventName}`, data);
            console.log(`FIXME: using selection contexts... ${eventName}`, this.state.selectionContexts);

            this.setState(state);

        });

    }

    public render() {

        return (

            <ContextMenu id={this.props.id}>

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

                    <MenuItem disabled={!this.state.selectionContexts.page}
                              onSelect={() => ContextMenuMessages.postContextMenuMessage("create-pagemark-to-point", this.state.triggerEvent!)}>

                        Create Pagemark to Point

                    </MenuItem>

                    <MenuItem disabled={!this.state.selectionContexts.page}
                              onSelect={() => ContextMenuMessages.postContextMenuMessage("create-pagemark", this.state.triggerEvent!)}>

                        Create Pagemark Box

                    </MenuItem>

                    <MenuItem disabled={!this.state.selectionContexts.page}
                              onSelect={() => ContextMenuMessages.postContextMenuMessage("create-area-highlight", this.state.triggerEvent!)}>

                        Create Area Highlight

                    </MenuItem>


                    <MenuItem disabled={!this.state.selectionContexts.pagemark}
                              onSelect={() => ContextMenuMessages.postContextMenuMessage("delete-pagemark", this.state.triggerEvent!)}>

                        Delete Pagemark

                    </MenuItem>


                    <MenuItem divider/>

                    <MenuItem onSelect={() => AnnotationSidebarClient.toggleAnnotationSidebar()}>

                        Toggle Annotation Sidebar

                    </MenuItem>

                </DropdownMenu>

            </ContextMenu>
        );

    }

}

interface IProps {
    readonly id: string;
}

interface IState {
    readonly selectionContexts: SelectionContexts;
    readonly triggerEvent?: TriggerEvent;
}


interface SelectionContexts {
    page: boolean;
    textHighlight: boolean;
    areaHighlight: boolean;
    pagemark: boolean;
}
