import * as React from 'react';
import {prepareContextMenuHandlers} from '@burtonator/react-context-menu-wrapper';
import {ContextMenuHandlers} from '@burtonator/react-context-menu-wrapper';
import {ContextMenuWrapper} from '@burtonator/react-context-menu-wrapper';
import {ContextMenu} from '../../js/ui/context_menu/ContextMenu';
import {NULL_FUNCTION} from '../../js/util/Functions';
import {KeyBoundMenuItem} from './KeyBoundMenuItem';
import {AppRuntime} from '../../js/AppRuntime';
import {IStyleMap} from '../../js/react/IStyleMap';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import Dropdown from 'reactstrap/lib/Dropdown';
import {DropdownToggle} from 'reactstrap';

let sequence: number = 0;
const Styles: IStyleMap = {

    DropdownMenu: {
        zIndex: 999,
        fontSize: '14px'
    },

};

export class DocContextMenu2 extends React.Component<IProps, IState> {

    private contextMenuHandlers: ContextMenuHandlers;

    private id: string;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.id = 'doc-context-menu2-' + sequence++;

        this.contextMenuHandlers = prepareContextMenuHandlers({id: this.id});

    }

    public render() {

        return (

            <div>

                <div {...this.contextMenuHandlers}>
                    {this.props.children}
                </div>

                <ContextMenuWrapper id={this.id}>

                    <div className="border shadow pt-2 pb-2"
                         style={{backgroundColor: 'white'}}>

                        <DropdownItem onClick={() => NULL_FUNCTION}>
                            Set Title
                        </DropdownItem>

                        <DropdownItem disabled={false}
                                      onClick={() => NULL_FUNCTION}>
                            Copy Original URL
                        </DropdownItem>

                        <DropdownItem disabled={false}
                                      hidden={AppRuntime.isBrowser()}
                                      onClick={() => NULL_FUNCTION}>
                            Show File
                        </DropdownItem>

                        <DropdownItem disabled={false}
                                      hidden={AppRuntime.isBrowser()}
                                      onClick={() => NULL_FUNCTION}>
                            Copy File Path
                        </DropdownItem>

                        <DropdownItem disabled={false}
                                      onClick={() => NULL_FUNCTION}>
                            Copy Document ID
                        </DropdownItem>

                        {/*TODO: maybe load original URL too?*/}

                        <DropdownItem divider />

                        <DropdownItem className="text-danger" onClick={NULL_FUNCTION}>
                            Delete
                        </DropdownItem>

                    </div>

                </ContextMenuWrapper>

            </div>

        );

    }

}


interface IProps {
}

interface IState {
}


