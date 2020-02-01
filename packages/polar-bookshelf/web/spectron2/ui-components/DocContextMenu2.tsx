import * as React from 'react';
import {
    ContextMenuHandlers,
    ContextMenuWrapper,
    prepareContextMenuHandlers
} from '@burtonator/react-context-menu-wrapper';
import {NULL_FUNCTION} from '../../../polar-shared/src/util/Functions';
import {AppRuntime} from '../../js/AppRuntime';
import {IStyleMap} from '../../js/react/IStyleMap';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import Button from 'reactstrap/lib/Button';

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

        class ToggleContext {
            public toggle() {
                // noop
            }
        }

        const Context = React.createContext(new ToggleContext());

        return (

            <div>

                <Context.Provider value={new ToggleContext()}>


                <div {...this.contextMenuHandlers}>
                    {this.props.children}
                </div>

                <ContextMenuWrapper id={this.id}>

                    <div className="border shadow pt-2 pb-2"
                         style={{backgroundColor: 'var(--white)'}}>

                        <Button type="button"
                                role="menuitem"
                                onClick={() => console.log("set title")}
                                className="dropdown-item">
                                Set Title
                        </Button>

                        <DropdownItem toggle={false}
                                      disabled={false}
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
                </Context.Provider>

            </div>

        );

    }

}


interface IProps {
}

interface IState {
}


