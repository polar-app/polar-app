import React from 'react';
import {Tag} from "polar-shared/src/tags/Tags";
import {TNode, TRoot} from "../../../../web/js/ui/tree/TreeView";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {createObservableStore} from "../../../../web/spectron0/material-ui/store/ObservableStore";
import {Provider} from "polar-shared/src/util/Providers";
import {useRepoDocInfos} from "../doc_repo/DocRepoHooks";
import {useTagsContext} from "../persistence_layer/PersistenceLayerApp";
import {TagNodes} from "../../../../web/js/tags/TagNodes";
import isEqual from "react-fast-compare";

export type NodeID = string;

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
    readonly selected: ReadonlyArray<NodeID>;

    /**
     * The state of expanded nodes.
     */
    readonly expanded: ReadonlyArray<NodeID>;

}

interface IFolderSidebarCallbacks {

    readonly toggleSelected: (nodes: ReadonlyArray<NodeID>) => void;
    readonly toggleExpanded: (nodes: ReadonlyArray<NodeID>) => void;

    readonly collapseNode: (node: NodeID) => void;
    readonly expandNode: (node: NodeID) => void;


}

const folderStore: IFolderSidebarStore = {
    filter: "",
    tags: [],
    foldersRoot: undefined,
    tagsRoot: undefined,
    selected: [],
    expanded: []
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

    // always sort the tags so that if they change slightly we at least have a
    // deterministic layout.
    tags = [...tags].sort((a, b) => a.count - b.count)

    if (! isEqual(store.tags, tags)) {
        const [foldersRoot, tagsRoot] = rebuildTree();

        setStore({...store, tags, foldersRoot, tagsRoot});
    } else {
        // noop
    }

}

function callbacksFactory(storeProvider: Provider<IFolderSidebarStore>,
                          setStore: (store: IFolderSidebarStore) => void,
                          mutator: Mutator): IFolderSidebarCallbacks {


    // used so that we listen to repoDocInfos and get them for every update
    // so that we can build a new store.
    //
    // TODO: This isn't an amazingly good way to listen for updates since we're
    // just trying to get the tagsContext working..
    useRepoDocInfos();

    const tagsContext = useTagsContext();

    // FIXME which tags type do we want? userTags or docTags???
    reduce(storeProvider(), setStore, tagsContext?.tagsProvider() || []);

    function toggleSelected(nodes: ReadonlyArray<NodeID>): void {

        const store = storeProvider();

        const selected = nodes;

        setStore({
            ...store,
            selected
        });
    }

    function toggleExpanded(nodes: ReadonlyArray<NodeID>): void {

        const store = storeProvider();

        // const expanded = doToggle(store.expanded, nodes);

        setStore({
            ...store,
            expanded: nodes
        });
    }

    function collapseNode(node: NodeID) {

        console.log("FIXME collapseNode: ", node);

        const store = storeProvider();

        const expanded = [...store.expanded]
            .filter(current => current !== node);

        setStore({...store, expanded});

    }

    function expandNode(node: NodeID) {

        console.log("FIXME expandNode: ", node);

        const store = storeProvider();

        const expanded = [...store.expanded];

        if (! expanded.includes(node)) {
            expanded.push(node);
        }

        setStore({...store, expanded});

    }

    return {
        toggleSelected, toggleExpanded, collapseNode, expandNode
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
