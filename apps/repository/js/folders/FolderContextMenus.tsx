import * as React from 'react';
import {ContextMenuWrapper, prepareContextMenuHandlers} from '@burtonator/react-context-menu-wrapper';
import {DropdownItem} from 'reactstrap';
import {FontAwesomeIcon} from "../../../../web/js/ui/fontawesome/FontAwesomeIcon";
import {TreeState} from "../../../../web/js/ui/tree/TreeState";
import {TagDescriptor} from "../../../../web/js/tags/TagNode";
import {TagStr} from "polar-shared/src/tags/Tags";

let sequence: number = 0;

const ENABLED = false;

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
    public static create(type: 'tag' | 'folder',
                         treeState: TreeState<TagDescriptor>,
                         onCreate: CreateFolderCallback): ContextMenuComponents {

        const id = 'folder-context-menu-' + sequence++;
        const contextMenuHandlers = prepareContextMenuHandlers({id});

        const render = (child: React.ReactElement) => {

            if (ENABLED) {

                return <div {...contextMenuHandlers}>
                    {child}
                </div>;

            }

            return <div>{child}</div>;

        };

        const doCreate = () => {
            const tags = treeState.selected.keys();
            onCreate(tags);
        };

        const hasSingleSelectedFolder = () => {
            return treeState.selected.keys().length === 1;
        };

        const MenuItemsForFolders = () => {

            return <DropdownItem toggle={false}
                                 disabled={! hasSingleSelectedFolder()}
                                 onClick={() => doCreate()}>
                <FontAwesomeIcon name="fas fa-folder-plus"/> Create Folder
            </DropdownItem>;

        };

        const MenuItemsForTags = () => {
            return <DropdownItem toggle={false}
                                 onClick={() => doCreate()}>
                <FontAwesomeIcon name="fas fa-tag"/> Create Tag
            </DropdownItem>;

        };

        const MenuItems = () => {

            switch (type) {
                case "tag":
                    return <MenuItemsForTags/>;
                case "folder":
                    return <MenuItemsForFolders/>;
            }

        };

        const contextMenu = () => {

            return <ContextMenuWrapper id={id}>
                <div className="border shadow rounded pt-2 pb-2"
                     style={{
                         backgroundColor: 'var(--primary-background-color)'
                     }}>

                    <MenuItems/>

                </div>

            </ContextMenuWrapper>;

        };

        return {render, contextMenu};

    }

}
