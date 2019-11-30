import * as React from 'react';
import {ContextMenuWrapper, prepareContextMenuHandlers} from '@burtonator/react-context-menu-wrapper';
import {DropdownItem} from 'reactstrap';
import {FontAwesomeIcon} from "../../../web/js/ui/fontawesome/FontAwesomeIcon";
import {TreeState} from "../../../web/js/ui/tree/TreeState";
import {TagDescriptor} from "../../../web/js/tags/TagNode";
import {TagStr} from "polar-shared/src/tags/Tags";

let sequence: number = 0;

const contextMenuComponentsFactory = (treeState: TreeState<TagDescriptor>) => {
    // treeState.selected.
};

export interface ContextMenuComponentsFactory<V> {
    // tslint:disable-next-line:callable-types
    (treeState: TreeState<V>): void;
}

export interface ContextMenuComponents {

    readonly render: (child: React.ReactElement) => void;

    readonly contextMenu: () => React.ReactElement;

}

export type CreateFolderCallback = (selected: ReadonlyArray<TagStr>) => void;

export class FolderContextMenus {

    /**
     * Create the handlers element and the actual context menu wrapper.
     */
    public static create(treeState: TreeState<TagDescriptor>,
                         createFolder: CreateFolderCallback): ContextMenuComponents {

        const id = 'folder-context-menu-' + sequence++;
        const contextMenuHandlers = prepareContextMenuHandlers({id});

        const render = (child: React.ReactElement) => {

            return <div {...contextMenuHandlers}>
                {child}
            </div>;

        };

        const onCreateFolder = () => {
            const tags = treeState.selected.keys();
            createFolder(tags);
        };

        const contextMenu = () => {

            return <ContextMenuWrapper id={id}>
                <div className="border shadow rounded pt-2 pb-2"
                     style={{
                         backgroundColor: 'var(--primary-background-color)'
                     }}>

                    <DropdownItem toggle={false}
                                  onClick={() => onCreateFolder()}>
                        <FontAwesomeIcon name="fas fa-folder-plus"/> Create Folder
                    </DropdownItem>

                </div>

            </ContextMenuWrapper>;

        };

        return {render, contextMenu};

    }

}
