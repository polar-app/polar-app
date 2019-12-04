import * as React from 'react';
import {ContextMenuWrapper, prepareContextMenuHandlers} from '@burtonator/react-context-menu-wrapper';
import {DropdownItem} from 'reactstrap';
import {FontAwesomeIcon} from "../../../../web/js/ui/fontawesome/FontAwesomeIcon";
import {TreeState} from "../../../../web/js/ui/tree/TreeState";
import {Tags, TagStr, TagType} from "polar-shared/src/tags/Tags";
import {Dialogs} from "../../../../web/js/ui/dialogs/Dialogs";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {InvalidInput} from "../../../../web/js/ui/dialogs/InputValidators";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {Paths} from "polar-shared/src/util/Paths";
import {DeleteIcon, FolderIcon, TagIcon} from "../../../../web/js/ui/icons/FixedWidthIcons";

let sequence: number = 0;

const ENABLED = true;

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

export type CreateFolderCallback = (type: TagType, newTag: TagStr) => void;

export class FolderContextMenus {

    /**
     * Create the handlers element and the actual context menu wrapper.
     */
    public static create(type: TagType,
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

            promptForCreate(type, (userTag: string) => {

                const createNewTag = (): TagStr => {

                    switch (type) {
                        case "tag":
                            return userTag;
                        case "folder":
                            return Paths.create(tags[0], userTag);
                    }
                };

                const newTag = createNewTag();

                onCreate(type, newTag);

            });

        };

        const doDelete = () => {
            // noop for now.
        };

        const hasSingleSelectedFolder = () => {
            return treeState.selected.keys().length === 1;
        };

        /**
         * Return true if the user has selected folders.
         */
        const hasSelectedFolders = () => {
            return treeState.selected.keys().length >= 1;
        };

        const MenuItemsForFolders = (): any => {

            return [
                <DropdownItem toggle={false}
                              key="create"
                              disabled={! hasSingleSelectedFolder()}
                              onClick={() => doCreate()}>
                    <FolderIcon/> Create Folder
                </DropdownItem>,
                <DropdownItem toggle={false}
                              key="delete"
                              className="text-danger"
                              onClick={() => doDelete()}>
                    <DeleteIcon/> Delete
                </DropdownItem>

            ];

        };

        const MenuItemsForTags = (): any => {

            return [
                <DropdownItem toggle={false}
                              key="create"
                              onClick={() => doCreate()}>
                    <TagIcon/> Create Tag
                </DropdownItem>,
                <DropdownItem toggle={false}
                              key="delete"
                              className="text-danger"
                              onClick={() => doDelete()}>
                    <DeleteIcon/> Delete
                </DropdownItem>

            ];

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

/**
 * Prompt to create a new type of folder or tag.
 */
export function promptForCreate(type: TagType, onDone: (value: string) => void) {

    const validator = (value: string): InvalidInput | undefined => {

        if (Tags.validate(value).isPresent()) {
            return undefined;
        }

        return {
            message: "Some tags were excluded - spaces and other control characters not supported"
        };

    };

    Dialogs.prompt({
        title: "Create new " + type,
        description: "May not create spaces and some extended unicode characters.",
        placeholder: "Enter name of new "  + type,
        validator,
        onCancel: NULL_FUNCTION,
        onDone
    });

}
