import * as React from 'react';
import {ContextMenuWrapper, prepareContextMenuHandlers} from '@burtonator/react-context-menu-wrapper';
import {DropdownItem} from 'reactstrap';
import {FontAwesomeIcon} from "../../../web/js/ui/fontawesome/FontAwesomeIcon";

let sequence: number = 0;

export interface FolderContextMenu {

    readonly renderChild: (child: React.ReactElement) => void;

    readonly contextMenu: () => React.ReactElement;

}

export class FolderContextMenus {

    /**
     * Create the handlers element and the actual context menu wrapper.
     */
    public static create(createFolder: () => void) {

        const id = 'folder-context-menu-' + sequence++;
        const contextMenuHandlers = prepareContextMenuHandlers({id});

        const renderChild = (child: React.ReactElement) => {

            return <div {...contextMenuHandlers}>
                {child}
            </div>;

        };

        const contextMenu = () => {

            return <ContextMenuWrapper id={id}>
                <div className="border shadow rounded pt-2 pb-2"
                     style={{
                         backgroundColor: 'var(--primary-background-color)'
                     }}>

                    <DropdownItem toggle={false}
                                  onClick={() => createFolder()}>
                        <FontAwesomeIcon name="fas fa-folder-plus"/> Create Folder
                    </DropdownItem>

                </div>

            </ContextMenuWrapper>;

        };

        return {renderChild, contextMenu};

    }

}
