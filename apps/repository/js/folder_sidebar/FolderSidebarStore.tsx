import React from 'react';
import {Tag} from "polar-shared/src/tags/Tags";
import {TNode, TRoot} from "../../../../web/js/ui/tree/TreeView";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {createObservableStore} from "../../../../web/spectron0/material-ui/store/ObservableStore";
import {Provider} from "polar-shared/src/util/Providers";
import {useRepoDocInfos} from "../doc_repo/DocRepoHooks";
import {
    useTagsContext,
    useTagsProvider
} from "../persistence_layer/PersistenceLayerApp";
import {TagNodes} from "../../../../web/js/tags/TagNodes";
import isEqual from "react-fast-compare";

interface MarkMap {
    [id: string]: boolean
}

interface IFolderSidebarStore {

    readonly filter: string;

    /**
     * The tags used to build the store. Used for rebuilding.
     */
    readonly tags: ReadonlyArray<Tag>;

    readonly foldersRoot: TRoot<TagDescriptor> | undefined;

    readonly tagsRoot: TRoot<TagDescriptor> | undefined;

    /**
     * The state of selected nodes.
     */
    readonly selected: Readonly<MarkMap>;

    /**
     * The state of expanded nodes.
     */
    readonly expanded: Readonly<MarkMap>;

}

interface IFolderSidebarCallbacks {

    readonly isSelected: (id: string) => boolean;
    readonly isExpanded: (id: string) => boolean;

    readonly toggleSelected: (id: string) => void;
    readonly toggleExpanded: (id: string) => void;

}

const folderStore: IFolderSidebarStore = {
    filter: "",
    tags: [],
    foldersRoot: undefined,
    tagsRoot: undefined,
    selected: {},
    expanded: {}
}

interface Mutator {

}

function mutatorFactory(): Mutator {
    return {};
}

function reduce(store: IFolderSidebarStore,
                setStore: (store: IFolderSidebarStore) => void,
                tags: ReadonlyArray<TagDescriptor>) {

    type TNodeTuple = [TNode<TagDescriptor>, TNode<TagDescriptor>];

    function rebuildTree(): TNodeTuple {
        const foldersRoot = TagNodes.createFoldersRoot({tags, type: 'folder'})
        const tagsRoot = TagNodes.createTagsRoot(tags);
        return [foldersRoot, tagsRoot];
    }

    if (! isEqual(store.tags, tags)) {
        console.log("FIXME FolderSidebarStore: reduce");
        const [foldersRoot, tagsRoot] = rebuildTree();

        setStore({...store, tags, foldersRoot, tagsRoot});
    } else {
        console.log("FIXME FolderSidebarStore: reduce SKIPPED");
    }

}

function callbacksFactory(storeProvider: Provider<IFolderSidebarStore>,
                          setStore: (store: IFolderSidebarStore) => void,
                          mutator: Mutator): IFolderSidebarCallbacks {

    console.log("FIXME callbacksFactory...");

    // used so that we listen to repoDocInfos and get them for every update
    // so that we can build a new store.
    useRepoDocInfos();

    const tagsContext = useTagsContext();

    // FIXME which tags type do we want? userTags or docTags???
    reduce(storeProvider(), setStore, tagsContext?.tagsProvider() || []);

    function isSelected(id: string): boolean {
        const store = storeProvider();
        return store.selected[id] === true;
    }

    function isExpanded(id: string): boolean {
        const store = storeProvider();
        return store.expanded[id] === true;
    }

    function toggleSelected(id: string): void {
        const store = storeProvider();

        const selected = {...store.selected};
        selected[id] = ! selected[id]

        setStore({
            ...store,
            selected
        });
    }

    function toggleExpanded(id: string): void {

        const store = storeProvider();

        const expanded = {...store.expanded};
        expanded[id] = ! expanded[id]

        setStore({
            ...store,
            expanded
        });
    }

    return {
        isSelected, isExpanded, toggleSelected, toggleExpanded
    };

}

export const [FolderSidebarStoreProvider, useFolderSidebarStore, useFolderSidebarCallbacks]
    = createObservableStore<IFolderSidebarStore, Mutator, IFolderSidebarCallbacks>({
    initialValue: folderStore,
    mutatorFactory,
    callbacksFactory
});

interface IProps {
    readonly children: JSX.Element;
}

export const FolderSidebarStore = (props: IProps) => {

    return (
        <FolderSidebarStoreProvider>
            {props.children}
        </FolderSidebarStoreProvider>
    )

}
