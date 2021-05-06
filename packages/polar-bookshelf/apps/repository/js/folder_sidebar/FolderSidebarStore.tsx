import React, {useContext} from 'react';
import {Tag, Tags, TagStr, TagType} from "polar-shared/src/tags/Tags";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {
    SetStore, UseContextHook
} from "../../../../web/js/react/store/ObservableStore";
import {Provider} from "polar-shared/src/util/Providers";
import {TagNodes} from "../../../../web/js/tags/TagNodes";
import isEqual from "react-fast-compare";
import {
    useTagDescriptorsContext
} from "../persistence_layer/PersistenceLayerApp";
import {useTagSidebarEventForwarder} from "../store/TagSidebarEventForwarder";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Paths} from "polar-shared/src/util/Paths";
import {BatchMutators} from "../BatchMutators";
import TagID = Tags.TagID;
import BatchMutatorOpts = BatchMutators.BatchMutatorOpts;
import {TRoot} from "../../../../web/js/ui/tree/TRoot";
import {useLogger} from "../../../../web/js/mui/MUILogger";
import {IAsyncTransaction} from "polar-shared/src/util/IAsyncTransaction";
import {isPresent} from "polar-shared/src/Preconditions";
import {useCreateTag, useDeleteTag, useRenameTag} from "../persistence_layer/PersistenceLayerMutator2";
import {createObservableStoreWithPrefsContext} from "../../../../web/js/react/store/ObservableStoreWithPrefsContext";
import {SelectionEvents2, SelectRowType} from '../doc_repo/SelectionEvents2';

export interface TagDescriptorSelected extends TagDescriptor {
    readonly selected: boolean
}

interface IFolderSidebarStore {

    /**
     * The filter of the current tags.
     */
    readonly filter: string;

    /**
     * The tags used to build the store. Used for rebuilding.
     */
    readonly tags: ReadonlyArray<TagDescriptor>;

    readonly tagsView: ReadonlyArray<TagDescriptor>;

    readonly foldersRoot: TRoot<TagDescriptorSelected> | undefined;

    /**
     * The state of selected nodes.
     */
    readonly selected: ReadonlyArray<TagID>;

    /**
     * The state of expanded nodes.
     */
    readonly expanded: ReadonlyArray<TagID>;

    readonly isProcessing: boolean;
}

interface IFolderSidebarCallbacks {

    readonly selectRow: (node: TagID, event: React.MouseEvent, source: SelectRowType) => void;

    readonly toggleExpanded: (nodes: ReadonlyArray<TagID>) => void;

    readonly collapseNode: (node: TagID) => void;

    readonly expandNode: (node: TagID) => void;

    readonly setFilter: (text: string) => void;

    readonly onCreateUserTag: (type: 'folder' | 'tag') => void;

    readonly onRenameUserTag: (type: 'folder' | 'tag') => void;

    /**
     * Dropped an item on the tag with the given viewIndex.
     */
    readonly onDrop: (tagID: TagID) => void;

    readonly onDelete: () => void;

    readonly resetSelected: () => void;

}

const initialStore: IFolderSidebarStore = {
    filter: "",
    tags: [],
    tagsView: [],
    foldersRoot: undefined,
    selected: [],
    expanded: [],
    isProcessing: false,
}

interface Mutation {
    readonly filter: string;
    readonly tags: ReadonlyArray<TagDescriptor>;
    readonly selected: ReadonlyArray<TagID>;
}

interface Mutator {

    readonly doUpdate: (mutation: Mutation) => void;
    readonly refresh: () => void;

}

function mutatorFactory(storeProvider: Provider<IFolderSidebarStore>,
                        setStore: SetStore<IFolderSidebarStore>): Mutator {

    function reduce(mutation: Mutation): IFolderSidebarStore | undefined {

        const store = storeProvider();

        function computeFiltered(tags: ReadonlyArray<TagDescriptor>) {

            const filterPredicate = (tag: TagDescriptor) => {
                return tag.label.toLowerCase().indexOf(mutation.filter) !== -1
            }

            if (mutation.filter.trim() !== '') {
                return tags.filter(filterPredicate);
            }

            return tags;

        }

        function rebuildStore(tags: ReadonlyArray<TagDescriptor>): IFolderSidebarStore | undefined{
            const filtered = computeFiltered(tags);

            const tagsView = Tags.onlyRegular(filtered);

            function buildFoldersRoot() {

                function toTagDescriptorSelected(tag: TagDescriptor): TagDescriptorSelected {

                    return {
                        ...tag,
                        selected: mutation.selected.includes(tag.id)
                    };
                }

                const rawFoldersRoot = TagNodes.createFoldersRoot({tags: filtered, type: 'folder'});
                return TagNodes.decorate(rawFoldersRoot, toTagDescriptorSelected);

            }

            const foldersRoot = buildFoldersRoot();

            return {
                ...store,
                filter: mutation.filter,
                selected: mutation.selected,
                tags,
                tagsView,
                foldersRoot
            }

        }

        /**
         * Return true if our data has changed and needs to be reduced.
         */
        function hasChanged() {

            if (store.foldersRoot === undefined) {
                return true;
            }

            if (! isEqual(store.tags, tags)) {
                return true;
            }

            if (! isEqual(store.selected, mutation.selected)) {
                return true;
            }

            if (store.filter.trim() !== mutation.filter.trim()) {
                return true;
            }

            return false;

        }

        // always sort the tags so that if they change slightly we at least have a
        // deterministic layout.
        const tags = [...mutation.tags].sort((a, b) => b.count - a.count)

        if (hasChanged()) {
            return rebuildStore(tags);
        }

        return undefined;

    }

    function doUpdate(mutation: Mutation) {

        const newStore = reduce(mutation);

        if (newStore) {
            setStore(newStore);
        }

    }

    function refresh() {
        const store = storeProvider();
        doUpdate(store);
    }

    return {doUpdate, refresh};

}

function useCallbacksFactory(storeProvider: Provider<IFolderSidebarStore>,
                             setStore: (store: IFolderSidebarStore) => void,
                             mutator: Mutator): IFolderSidebarCallbacks {

    // used so that we listen to repoDocInfos and get them for every update
    // so that we can build a new store.
    //
    // TODO: This isn't an amazingly good way to listen for updates since we're
    // just trying to get the tagsContext working..

    const tagDescriptorsContext = useTagDescriptorsContext();
    const tagSidebarEventForwarder = useTagSidebarEventForwarder();
    const dialogs = useDialogManager();
    const log = useLogger();
    const createTag = useCreateTag();
    const deleteTag = useDeleteTag();
    const renameTag = useRenameTag();

    function doHookUpdate() {

        const store = storeProvider();

        const tags = tagDescriptorsContext?.tagDescriptorsProvider() || [];

        mutator.doUpdate({...store, tags});
    }

    React.useEffect(() => {
        doHookUpdate();
    });

    return React.useMemo(() => {

        function doSelectRow(nodes: ReadonlyArray<TagID>) {

            const store = storeProvider();

            const selectedTags = Tags.lookupByTagLiteral(store.tags, nodes, Tags.create);
            tagSidebarEventForwarder.onTagSelected(selectedTags);

        }

        function selectRow(node: TagID,
                           event: React.MouseEvent,
                           type: SelectRowType): void {

            const store = storeProvider();

            const folderRoot = store.foldersRoot ? [store.foldersRoot.value] : [];
            const selected = SelectionEvents2.selectRow(node,
                                                        store.selected,
                                                        [...store.tags, ...folderRoot],
                                                        event,
                                                        type);

            mutator.doUpdate({...store, selected});
            doSelectRow(selected);
        }

        function toggleExpanded(nodes: ReadonlyArray<TagID>): void {

            const store = storeProvider();

            // const expanded = doToggle(store.expanded, nodes);

            setStore({
                ...store,
                expanded: nodes
            });
        }

        function collapseNode(node: TagID) {

            const store = storeProvider();

            const expanded = [...store.expanded]
                .filter(current => current !== node);

            setStore({...store, expanded});

        }

        function expandNode(node: TagID) {

            const store = storeProvider();

            const expanded = [...store.expanded];

            if (! expanded.includes(node)) {
                expanded.push(node);
            }

            setStore({...store, expanded});

        }

        function setFilter(filter: string) {

            const store = storeProvider();

            // TODO: it might be nice if this was a state, which can be restore
            // after the filter but not sure about that
            mutator.doUpdate({...store, filter, selected: []});

        }

        function doCreateUserTag(userTag: string, type: TagType) {

            const createNewTag = (): TagStr => {

                const store = storeProvider();
                const selectedTags = store.selected;

                switch (type) {
                    case "tag":
                        return userTag;
                    case "folder":
                        const parent = selectedTags.length > 0 ? selectedTags[0] : '/';
                        return Paths.create(parent, userTag);
                }
            };

            const newTag = createNewTag();

            async function doHandle() {
                await createTag(newTag);
                dialogs.snackbar({message: `Tag '${newTag}' created successfully.`});
            }

            doHandle()
                .catch(err => log.error("Unable to create tag: " + newTag, err));

        }

        function onCreateUserTag(type: TagType) {

            dialogs.prompt({
                title: "Create new " + type,
                description: "May not create spaces and some extended unicode characters.",
                autoFocus: true,
                onCancel: NULL_FUNCTION,
                onDone: (text) => doCreateUserTag(text, type)
            });

        }

        function onRenameUserTag(type: TagType) {
            const selected = selectedTags();
            const store = storeProvider();
            if (selected.length === 0 || store.isProcessing) {
                return;
            }

            const tagToBeRenamed = selected[0];
            const baseDir        = Paths.dirname(tagToBeRenamed.id);

            function handleRename(text: string) {
                resetSelected();
                switch (type) {
                    case "tag":
                        doRenameUserTag(tagToBeRenamed, { label: text }, type);
                        break;
                    case "folder":
                        doRenameUserTag(tagToBeRenamed, { label: Paths.create(baseDir, text) }, type);
                        break;
                }
            }

            dialogs.prompt({
                title: `Rename ${type} ${Paths.basename(tagToBeRenamed.id)}`,
                autoFocus: true,
                onCancel: NULL_FUNCTION,
                onDone: handleRename,
            });
        }

        function doRenameUserTag(tagToBeRenamed: Tag, newTagData: Omit<Tag, 'id'>, type: TagType) {
            const store = storeProvider();

            let transactions: ReadonlyArray<IAsyncTransaction<void>>;
            const newTag: Tag = { ...newTagData, id: newTagData.label };
            switch (type) {
            case "tag":
                transactions = [renameTag(tagToBeRenamed, newTag)];
                break;
            case "folder":
                const foldersToBeRenamed = store.tags.filter(tag => tag.id.startsWith(tagToBeRenamed.id));
                transactions = foldersToBeRenamed.map(folder => {
                    const newPath = folder.id.replace(tagToBeRenamed.id, newTagData.label);
                    return renameTag(folder, { ...folder, label: newPath, id: newPath });
                });
                break;
            }

            const doAsync = async () => {
                setStore({ ...store, isProcessing: true });
                try {
                    await withBatch(transactions, {error: "Unable to rename tag: "})
                    setStore({ ...store, isProcessing: false });
                } catch(err) {
                    setStore({ ...store, isProcessing: false });
                }
            };

            doAsync().catch((err) => log.error("Could not rename tag.", err));
        }

        function onDrop(tagID: TagID) {

            console.log("Handling folder drop for: " + tagID);

            const store = storeProvider();

            const selectedTags = Tags.lookupByTagLiteral(store.tags, [tagID], Tags.create);

            const selectedTag = selectedTags[0];

            tagSidebarEventForwarder.onDropped(selectedTag);

        }

        function selectedTags(): ReadonlyArray<Tag> {
            const store = storeProvider();
            const tagsMap = Tags.toMap(store.tags);

            return store.selected.map(current => tagsMap[current])
                                 .filter(current => isPresent(current));

        }

        async function withBatch<T>(transactions: ReadonlyArray<IAsyncTransaction<T>>,
                                    opts: Partial<BatchMutatorOpts> = {}) {

            await BatchMutators.exec(transactions, {
                ...opts,
                refresh: mutator.refresh,
                dialogs
            });

        }

        function doDelete(selected: ReadonlyArray<Tag>) {
            const store = storeProvider();

            const isFolder = (tag: Tag) => tag.id.startsWith('/');
            const tags = selected.flatMap(item => (
                isFolder(item)
                    ? store.tags.filter(sitem => sitem.id.startsWith(item.id))
                    : [item]
            ));

            const doAsync = async () => {
                setStore({ ...store, isProcessing: true });
                try {
                    await withBatch(tags.map(tag => deleteTag(tag.id)), {error: "Unable to delete tag: "})
                    setStore({ ...store, isProcessing: false });
                } catch(err) {
                    setStore({ ...store, isProcessing: false });
                }
            };

            doAsync().catch((err) => log.error("Could not delete tag.", err));
        }

        function onDelete() {
            const selected = selectedTags();
            const store = storeProvider();
            if (selected.length === 0 || store.isProcessing) {
                return;
            }

            function handleDeleted() {
                resetSelected();
                doDelete(selected);
            }

            dialogs.confirm({
                title: `Are you sure you want to delete these tags/folders?`,
                subtitle: <div>
                    <p>
                        This is a permanent operation and can't be undone.
                    </p>
                    </div>,
                onCancel: NULL_FUNCTION,
                type: 'danger',
                onAccept: handleDeleted
            });

        }

        function resetSelected() {
            const store = storeProvider();
            const newSelected = ['/'];
            mutator.doUpdate({...store, selected: newSelected});
            doSelectRow(newSelected)
        }

        return {
            toggleExpanded,
            collapseNode,
            expandNode,
            setFilter,
            selectRow,
            onCreateUserTag,
            onRenameUserTag,
            onDrop,
            onDelete,
            resetSelected
        };

    }, [storeProvider,
        tagSidebarEventForwarder,
        mutator,
        setStore,
        createTag,
        dialogs,
        log,
        deleteTag,
        renameTag,
    ]);


}

// export type UseFolderSidebarStore = UseStoreHook<IFolderSidebarStore>;
// export type UseFolderSidebarStore = (keys: ReadonlyArray<keyof IFolderSidebarStore> | undefined) => Pick<IFolderSidebarStore, keyof IFolderSidebarStore>;
export type UseFolderSidebarStore = <K extends keyof IFolderSidebarStore>(keys: ReadonlyArray<K> | undefined) => Pick<IFolderSidebarStore, K>;

export type UseFolderSidebarCallbacks = UseContextHook<IFolderSidebarCallbacks>

export function createFolderSidebarStore(name: string) {

    const pref = name + '-sidebar-store';

    return createObservableStoreWithPrefsContext<IFolderSidebarStore, Mutator, IFolderSidebarCallbacks>({
          initialValue: initialStore,
          mutatorFactory,
          callbacksFactory: useCallbacksFactory,
          enableShallowEquals: true
    }, pref, ['expanded']);

}

export const FolderSidebarStoreContext = React.createContext<UseFolderSidebarStore>(null!);
export const FolderSidebarCallbacksContext = React.createContext<UseFolderSidebarCallbacks>(null!);

export function useFolderSidebarStore(keys: ReadonlyArray<keyof IFolderSidebarStore> | undefined) {
    const delegate = useContext(FolderSidebarStoreContext);
    return delegate(keys);
}

export function useFolderSidebarCallbacks() {
    const delegate = useContext(FolderSidebarCallbacksContext);
    return delegate();
}
