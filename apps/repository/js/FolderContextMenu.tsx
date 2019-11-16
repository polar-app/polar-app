import * as React from 'react';
import {
    ContextMenuHandlers,
    ContextMenuWrapper,
    prepareContextMenuHandlers
} from '@burtonator/react-context-menu-wrapper';
import {DropdownItem} from 'reactstrap';
import {FontAwesomeIcon} from "../../../web/js/ui/fontawesome/FontAwesomeIcon";

let sequence: number = 0;

export class FolderContextMenu extends React.PureComponent<IProps, IState> {

    private contextMenuHandlers: ContextMenuHandlers;

    private id: string;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.id = 'folder-context-menu-' + sequence++;

        this.contextMenuHandlers = prepareContextMenuHandlers({id: this.id});

    }

    public render() {

        return (

            <div>

                <div {...this.contextMenuHandlers}>
                    {this.props.children}
                </div>

                <ContextMenuWrapper id={this.id}>

                    <div className="border shadow rounded pt-2 pb-2"
                         style={{
                             backgroundColor: 'var(--white)'
                         }}>

                        <DropdownItem toggle={this.props.toggle}
                                      onClick={() => this.props.onCreateFolder()}>
                            <FontAwesomeIcon name="fas fa-folder-plus"/> Create Folder
                        </DropdownItem>

                    </div>

                </ContextMenuWrapper>

            </div>

        );

    }

}


interface IProps {
    readonly onCreateFolder: () => void;
    readonly toggle: boolean;
}

interface IState {
}


