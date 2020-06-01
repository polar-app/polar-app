import * as React from 'react';
import {ContextMenuWrapper, prepareContextMenuHandlers} from '@burtonator/react-context-menu-wrapper';
import {DropdownItem} from 'reactstrap';
import {TreeState} from "../../../../web/js/ui/tree/TreeState";
import {Tags, TagStr, TagType} from "polar-shared/src/tags/Tags";
import {Dialogs} from "../../../../web/js/ui/dialogs/Dialogs";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {InvalidInput} from "../../../../web/js/ui/dialogs/InputValidators";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {Paths} from "polar-shared/src/util/Paths";
import {DeleteIcon, FolderIcon, TagIcon} from "../../../../web/js/ui/icons/FixedWidthIcons";
import {PersistenceLayerMutator} from "../persistence_layer/PersistenceLayerMutator";
import {Logger} from "polar-shared/src/logger/Logger";
import {Preconditions} from "polar-shared/src/Preconditions";

let sequence: number = 0;

const ENABLED = true;

const log = Logger.create();

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

    readonly createUserTag: CreateUserTagCallback;

}

export type CreateFolderCallback = (type: TagType, newTag: TagStr) => void;

export interface FolderContextMenuOpts {

    readonly type: TagType;

    readonly treeState: TreeState<TagDescriptor>;

    readonly persistenceLayerMutator: PersistenceLayerMutator;

}

export type CreateUserTagCallback = (type: TagType) => void;

export class FolderContextMenus {

    /**
     * Create the handlers element and the actual context menu wrapper.
     */
    public static create(opts: FolderContextMenuOpts): ContextMenuComponents {

        const {type, treeState, persistenceLayerMutator} = opts;

        Preconditions.assertPresent(persistenceLayerMutator, 'persistenceLayerMutator');

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

        const createUserTag = (type: TagType) => {

            const tags = treeState.selected.keys();

            promptForCreate(type, (userTag: string) => {

                const createNewTag = (): TagStr => {

                    switch (type) {
                        case "tag":
                            return userTag;
                        case "folder":
                            const parent = tags.length > 0 ? tags[0] : '/';
                            return Paths.create(parent, userTag);
                    }

                };

                const newTag = createNewTag();

                // FIXME: refactor this to pass createTag as part of context...

                persistenceLayerMutator.createTag(newTag)
                    .catch(err => log.error("Unable to create tag: " + newTag, err));

            });

        };

        const confirmDelete = (onConfirm: () => void) => {

            Dialogs.confirm({
                title: `Are you sure you want to delete this ${type}?`,
                subtitle: <div>
                    <p>
                        The tag will be removed from all your documents and annotations.
                    </p>
                    <p>
                        This is a permanent operation and can't be undone.
                    </p>
                    </div>,
                onCancel: NULL_FUNCTION,
                type: 'danger',
                onConfirm
            });

        };

        const doDelete = () => {

            const deleteDelegate = () => {

                const tags = treeState.selected.keys();
                const tag = tags[0];

                persistenceLayerMutator.deleteTag(tag)
                    .catch(err => log.error("Unable to delete tag: " + tag, err));

            };

            confirmDelete(() => deleteDelegate());

        };

        const hasSingleSelectedTag = () => {
            return treeState.selected.keys().length === 1;
        };

        /**
         * Return true if the user has selected folders.
         */
        const hasSelectedTags = () => {
            return treeState.selected.keys().length >= 1;
        };

        const DeleteDropdownItem = () =>
            <DropdownItem toggle={false}
                          hidden={! hasSelectedTags()}
                          className="text-danger"
                          onClick={() => doDelete()}>
                <DeleteIcon/> Delete
            </DropdownItem>
        ;

        const MenuItemsForFolders = (): any => {

            return [
                <DropdownItem toggle={false}
                              key="create"
                              disabled={! hasSingleSelectedTag()}
                              onClick={() => createUserTag(type)}>
                    <FolderIcon/> Create Folder
                </DropdownItem>,
                <DropdownItem key="divider1" divider/>,
                <DeleteDropdownItem key="delete"/>
            ];

        };

        const MenuItemsForTags = (): any => {

            return [
                <DropdownItem toggle={false}
                              key="create"
                              onClick={() => createUserTag(type)}>
                    <TagIcon/> Create Tag
                </DropdownItem>,
                <DropdownItem key="divider1" divider/>,
                <DeleteDropdownItem key="delete"/>
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

        return {render, contextMenu, createUserTag};

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
