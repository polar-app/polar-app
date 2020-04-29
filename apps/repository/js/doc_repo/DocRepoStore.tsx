import {RepoDocInfo} from "../RepoDocInfo";
import {
    DocRepoTableColumns,
    DocRepoTableColumnsMap
} from "./DocRepoTableColumns";
import React, {useEffect} from "react";
import {IDMaps} from "polar-shared/src/util/IDMaps";
import {Sorting} from "../../../../web/spectron0/material-ui/doc_repo_table/Sorting";
import {Provider} from "polar-shared/src/util/Providers";
import {RepoDocMetaLoader} from "../RepoDocMetaLoader";
import {RepoDocMetaManager} from "../RepoDocMetaManager";
import {DocRepoFilters2} from "./DocRepoFilters2";
import {isPresent, Preconditions} from "polar-shared/src/Preconditions";
import {Debouncers} from "polar-shared/src/util/Debouncers";
import {SelectRowType} from "./DocRepoScreen";
import {
    Callback,
    Callback1,
    Callback2,
    NULL_FUNCTION
} from "polar-shared/src/util/Functions";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Mappers} from "polar-shared/src/util/Mapper";
import {Tag} from "polar-shared/src/tags/Tags";
import {
    DialogManager,
    MUIDialogControllerContext
} from "../../../../web/spectron0/material-ui/dialogs/MUIDialogController";
import {MUITagInputControls} from "../MUITagInputControls";
import {AutocompleteDialogProps} from "../../../../web/js/ui/dialogs/AutocompleteDialog";
import {
    createContextMemo,
    useContextMemo
} from "../../../../web/js/react/ContextMemo";
import {DraggingSelectedDocs} from "./SelectedDocs";
import {TreeState} from "../../../../web/js/ui/tree/TreeState";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {TableSelection} from "./TableSelection";

interface IDocRepoStore {

    readonly data: ReadonlyArray<RepoDocInfo>;

    /**
     * The sorted view of the data based on the order and orderBy.
     */
    readonly view: ReadonlyArray<RepoDocInfo>;

    /**
     * The page data based on a slice of view, and the page number.
     */
    readonly viewPage: ReadonlyArray<RepoDocInfo>;

    /**
     * The columns the user wants to view.
     */
    readonly columns: DocRepoTableColumnsMap;

    /**
     * The selected records as pointers in to viewPage
     */
    readonly selected: ReadonlyArray<number>;

    /**
     * The sorting order.
     */
    readonly order: Sorting.Order,

    /**
     * The column we are sorting by.
     */
    readonly orderBy: keyof RepoDocInfo;

    /**
     * The page number we're viewing
     */
    readonly page: number;

    /**
     * The rows per page we have.
     */
    readonly rowsPerPage: number;

    readonly filters: DocRepoFilters2.Filters;

}

interface IDocRepoFolderStore {
    readonly treeState: TreeState<TagDescriptor>;
    readonly sidebarFilter: string;
    readonly setSidebarFilter: (sidebarFilter: string) => void;
}

// FIXME: move selected into its own context...

export interface IDocRepoActions {

    readonly selectedProvider: Provider<ReadonlyArray<RepoDocInfo>>;

    readonly selectRow: (selectedIdx: number,
                         event: React.MouseEvent,
                         type: SelectRowType) => void;

    readonly setPage: (page: number) => void;
    readonly setRowsPerPage: (rowsPerPage: number) => void;
    readonly setSelected: (selected: ReadonlyArray<number>) => void;
    readonly setFilters: (filters: DocRepoFilters2.Filters) => void;
    readonly setSort: (order: Sorting.Order, orderBy: keyof RepoDocInfo) => void;
    readonly onTagged: Callback2<ReadonlyArray<RepoDocInfo>, ReadonlyArray<Tag>>;
    readonly onOpen: Callback1<RepoDocInfo>;
    readonly onRename: (repoDocInfo: RepoDocInfo, title: string) => void;
    readonly onShowFile: Callback1<RepoDocInfo>;
    readonly onCopyOriginalURL: Callback1<RepoDocInfo>;
    readonly onCopyFilePath: Callback1<RepoDocInfo>;
    readonly onCopyDocumentID: Callback1<RepoDocInfo>;
    readonly onDeleted: (repoDocInfos: ReadonlyArray<RepoDocInfo>) => void;
    readonly onArchived: Callback2<ReadonlyArray<RepoDocInfo>, boolean>;
    readonly onFlagged: Callback2<ReadonlyArray<RepoDocInfo>, boolean>;


    readonly onDropped: (repoDocInfos: ReadonlyArray<RepoDocInfo>, tag: Tag) => void;
    readonly onTagSelected: (tags: ReadonlyArray<string>) => void;


    // drag and drop support


    // readonly setFilters: (filters: DocRepoFilters2.Filters) => {
    //
    // }

}

/**
 * These take the currently selected items, and use the store ctions on them
 * directly so that the logic around selected vs first is centralized in
 * the store.
 */
interface IDocRepoCallbacks {
    readonly onTagged: Callback;
    readonly onOpen: Callback;
    readonly onRename: Callback;
    readonly onShowFile: Callback;
    readonly onCopyOriginalURL: Callback;
    readonly onCopyFilePath: Callback;
    readonly onCopyDocumentID: Callback;
    readonly onDeleted: Callback;
    readonly onArchived: Callback;
    readonly onFlagged: Callback;

    readonly onDragStart: (event: React.DragEvent) => void;
    readonly onDragEnd: () => void;

    /**
     * Called when an doc is actually dropped on a tag.
     */
    readonly onDropped: (tag: Tag) => void;

    /**
     * Called when the user is filtering the UI based on a tag and is narrowing
     * down what's displayed by one or more tag.
     */
    readonly onTagSelected: (tags: ReadonlyArray<string>) => void;

}

const initialStore: IDocRepoStore = {
    data: [],
    view: [],
    viewPage: [],
    selected: [],

    // FIXME this is actually another component and shouldn't be here I think..

    // FIXME: I think some of these are more the view configuration and
    // should probably be sorted outside the main repo
    columns: IDMaps.create(Object.values(new DocRepoTableColumns())),

    orderBy: 'progress',
    order: 'desc',
    page: 0,
    rowsPerPage: 25,

    filters: {},
}

// create tracer function for actions...
function tracer(name: string) {
    return (arg0?: any, arg1?: any) => {
        console.info(name, arg0, arg1);
    }
}

const defaultActions: IDocRepoActions = {
    selectRow: NULL_FUNCTION,
    selectedProvider: () => [],

    setPage: tracer('action:setPage'),
    setRowsPerPage: tracer('action:setRowsPerPage'),
    setSelected: tracer('action:setSelected'),
    setFilters: tracer('action:setFilters'),
    setSort: tracer('action:setSort'),

    onTagged: tracer('action:onTagged'),
    onOpen: tracer('action:onOpen'),
    onRename: tracer('action:onRename'),
    onShowFile: tracer('action:onShowFile'),
    onCopyOriginalURL: tracer('action:onCopyOriginalURL'),
    onCopyFilePath: tracer('action:onCopyFilePath'),
    onCopyDocumentID: tracer('action:onCopyDocumentID'),
    onDeleted: tracer('action:onDeleted FIXME1'),
    onArchived: tracer('action:onArchived'),
    onFlagged: tracer('action:onFlagged'),
    onDropped: tracer('action:onDropped'),
    onTagSelected: tracer('action:onTagSelected')
}

const defaultCallbacks: IDocRepoCallbacks = {
    onTagged: tracer('callback:onTagged'),
    onOpen: tracer('callback:onOpen'),
    onRename: tracer('callback:onRename'),
    onShowFile: tracer('callback:onShowFile'),
    onCopyOriginalURL: tracer('callback:onCopyOriginalURL'),
    onCopyFilePath: tracer('callback:onCopyFilePath'),
    onCopyDocumentID: tracer('callback:onCopyDocumentID'),
    onDeleted: tracer('callback:onDeleted'),
    onArchived: tracer('callback:onArchived'),
    onFlagged: tracer('callback:onFlagged'),

    onDragStart: tracer('callback:onDragStart'),
    onDragEnd: tracer('callback:onDragEnd'),
    onDropped: tracer('callback:onDropped'),

    onTagSelected: tracer('callback:onTagSelected'),

}

export const DocRepoStoreContext = createContextMemo<IDocRepoStore>(initialStore)

export const DocRepoActionsContext = createContextMemo<IDocRepoActions>(defaultActions)

export const DocRepoCallbacksContext = createContextMemo<IDocRepoCallbacks>(defaultCallbacks)

export const DocRepoFolderStoreContext = createContextMemo<IDocRepoFolderStore>({
    treeState: new TreeState<TagDescriptor>(NULL_FUNCTION, NULL_FUNCTION),
    sidebarFilter: "",
    setSidebarFilter: NULL_FUNCTION
})

export function useDocRepoStore() {
    return useContextMemo(DocRepoStoreContext);
}

export function useDocRepoActions() {
    return useContextMemo(DocRepoActionsContext);
}

export function useDocRepoCallbacks() {
    return useContextMemo(DocRepoCallbacksContext);
}
export function useDocRepoFolderStore() {
    return useContextMemo(DocRepoFolderStoreContext);
}


function useComponentDidMount<T>(delegate: () => void) {
    // https://dev.to/trentyang/replace-lifecycle-with-hooks-in-react-3d4n
    useEffect(() => delegate(), []);
}

function useComponentWillUnmount(delegate: () => void) {
    useEffect(() => delegate, []);
}

interface IProps {
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly tagsProvider: Provider<ReadonlyArray<Tag>>;

    readonly children: React.ReactNode;
}

interface IState extends IDocRepoStore, IDocRepoFolderStore {

}

/**
 * Apply a reducer a temporary state, to compute the effective state.
 */
function reduce(tmpState: IDocRepoStore): IDocRepoStore {

    // compute the view, then the viewPage

    // FIXME: we only have to resort and recompute the view when the filters
    // or the sort order changes.

    const {data, page, rowsPerPage, order, orderBy, filters} = tmpState;

    // Now that we have new data, we have to also apply the filters and sort
    // order to the results, then update the view + viewPage

    const view = Mappers.create(data)
                        .map(current => DocRepoFilters2.execute(current, filters))
                        .map(current => Sorting.stableSort(current, Sorting.getComparator(order, orderBy)))
                        .collect()

    const viewPage = view.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const newState = {...tmpState, view, viewPage};

    return newState;

}

export class DocRepoStore extends React.Component<IProps, IState> {

    private eventListener: Callback = NULL_FUNCTION;
    private callbacks: IDocRepoCallbacks;
    private actions: IDocRepoActions;
    private dialogs: DialogManager | undefined;

    constructor(props: Readonly<IProps>) {
        super(props);

        this.doUpdate = this.doUpdate.bind(this);
        this.doReduceAndUpdateState = this.doReduceAndUpdateState.bind(this);
        this.selectRow = this.selectRow.bind(this);
        this.selectedProvider = this.selectedProvider.bind(this);
        this.setPage = this.setPage.bind(this);
        this.setRowsPerPage = this.setRowsPerPage.bind(this);
        this.setSelected = this.setSelected.bind(this);
        this.setFilters = this.setFilters.bind(this);
        this.setSort = this.setSort.bind(this);
        this.setSidebarFilter = this.setSidebarFilter.bind(this);

        // the debouncer here is VERY important... otherwise we lock up completely
        this.eventListener = Debouncers.create(() => {
            this.doUpdate();
        });

        this.actions = this.createActions();
        this.callbacks = this.createCallbacks(this.actions);

        this.state = {
            ...initialStore,
            treeState: new TreeState<TagDescriptor>(this.callbacks.onTagSelected,
                                                    this.callbacks.onDropped),
            sidebarFilter: "",
            setSidebarFilter: this.setSidebarFilter
        };
    }

    public componentDidMount(): void {
        const {repoDocMetaLoader} = this.props;
        this.doUpdate();
        repoDocMetaLoader.addEventListener(this.eventListener)
    }

    public componentWillUnmount(): void {
        const {repoDocMetaLoader} = this.props;
        Preconditions.assertCondition(repoDocMetaLoader.removeEventListener(this.eventListener),
                                      "Failed to remove event listener");
    }

    private doUpdate() {

        const {repoDocMetaManager} = this.props;

        setTimeout(() => {
            const data = repoDocMetaManager.repoDocInfoIndex.values();
            this.doReduceAndUpdateState({...this.state, data});
        }, 1);

    }

    private doReduceAndUpdateState(tmpState: IDocRepoStore) {

        setTimeout(() => {
            const newState = reduce({...tmpState});
            this.setState(newState);
        }, 1)

    };

    public selectRow(selectedIdx: number,
                     event: React.MouseEvent,
                     type: SelectRowType) {

        const selected = TableSelection.selectRow(selectedIdx,
                                             event,
                                             type,
                                             this.state.selected);

        this.setState({
            ...this.state,
            selected: selected || []
        });

    }

    public selectedProvider(): ReadonlyArray<RepoDocInfo> {
        return arrayStream(this.state.selected)
            .map(current => this.state.view[current])
            .collect();
    };

    public setPage(page: number) {
        this.doReduceAndUpdateState({
            ...this.state,
            page,
            selected: []
        });
    };

    public setRowsPerPage(rowsPerPage: number) {
        this.doReduceAndUpdateState({
            ...this.state,
            rowsPerPage,
            page: 0,
            selected: []
        });
    };

    public setSelected(selected: ReadonlyArray<number>) {
        this.setState({
            ...this.state,
            selected
        });
    }

    public setFilters(filters: DocRepoFilters2.Filters) {
        this.doReduceAndUpdateState({
            ...this.state,
            filters,
            page: 0,
            selected: []
        });
    }

    public setSort(order: Sorting.Order, orderBy: keyof RepoDocInfo) {

        this.doReduceAndUpdateState({
            ...this.state,
            order,
            orderBy,
            page: 0,
            selected: []
        });

    }

    public setSidebarFilter(sidebarFilter: string) {
        this.setState({sidebarFilter});
    }

    private createCallbacks(actions: IDocRepoActions): IDocRepoCallbacks {

        const first = () => {
            const selected = this.selectedProvider();
            return selected.length >= 1 ? selected[0] : undefined
        }

        const onDragStart = (event: React.DragEvent) => {

            console.log("onDragStart");

            const configureDragImage = () => {
                // TODO: this actually DOES NOT work but it's a better effect than the
                // default and a lot less confusing.  In the future we should migrate
                // to showing the thumbnail of the doc once we have this feature
                // implemented.

                const src: HTMLElement = document.createElement("div");

                // https://kryogenix.org/code/browser/custom-drag-image.html
                event.dataTransfer!.setDragImage(src, 0, 0);
            };

            configureDragImage();

            const selected = this.selectedProvider();
            DraggingSelectedDocs.set(selected);

        }

        const onDragEnd = () => {
            console.log("onDragEnd");
            DraggingSelectedDocs.clear();
        };

        const onDropped = (tag: Tag) => {
            const dragged = DraggingSelectedDocs.get();
            if (dragged) {
                actions.onDropped(dragged, tag);
            }
        }

        const onRename = () => {

            const repoDocInfo = first()!;

            this.dialogs!.prompt({
                title: "Enter a new title for the document:",
                defaultValue: repoDocInfo.title,
                onCancel: NULL_FUNCTION,
                onDone: (value) => actions.onRename(repoDocInfo, value)
            });

        };

        const onDeleted = () => {

            const repoDocInfos = this.selectedProvider();

            if (repoDocInfos.length === 0) {
                // no work to do
                return;
            }

            this.dialogs!.confirm({
                title: "Are you sure you want to delete these item(s)?",
                subtitle: "This is a permanent operation and can't be undone.  ",
                type: 'danger',
                onAccept: () => actions.onDeleted(repoDocInfos),
            });

        }

        const onTagged = () => {

            const repoDocInfos = this.selectedProvider();

            if (repoDocInfos.length === 0) {
                // no work to do
                return;
            }

            const {repoDocMetaManager, tagsProvider} = this.props;

            const availableTags = tagsProvider();
            const existingTags = repoDocInfos.length === 1 ? Object.values(repoDocInfos[0].tags || {}) : [];

            const toAutocompleteOption = MUITagInputControls.toAutocompleteOption;

            const {relatedTagsManager} = repoDocMetaManager;

            const relatedOptionsCalculator = (tags: ReadonlyArray<Tag>) => {

                // TODO convert this to NOT use tag strings but to use tag objects

                const computed = relatedTagsManager.compute(tags.map(current => current.id))
                                                   .map(current => current.tag);

                // now look this up directly.
                const resolved = arrayStream(tagsProvider())
                    .filter(current => computed.includes(current.id))
                    .map(toAutocompleteOption)
                    .collect();

                return resolved;

            };

            const autocompleteProps: AutocompleteDialogProps<Tag> = {
                title: "Assign Tags to Document",
                options: availableTags.map(toAutocompleteOption),
                defaultOptions: existingTags.map(toAutocompleteOption),
                createOption: MUITagInputControls.createOption,
                // FIXME: add this back in...
                // relatedOptionsCalculator: (tags) => relatedTagsManager.compute(tags.map(current => current.label)),
                onCancel: NULL_FUNCTION,
                onChange: NULL_FUNCTION,
                onDone: tags => actions.onTagged(repoDocInfos, tags)
            };

            this.dialogs!.autocomplete(autocompleteProps);

        }


        // private onArchived(repoDocInfos: ReadonlyArray<RepoDocInfo>) {
        //
        //     if (repoDocInfos.length === 0) {
        //         return;
        //     }
        //
        //     this.dialogs!.confirm({
        //         title: "Are you sure you want to archive these document(s)?",
        //         subtitle: "They won't be deleted but will be hidden by default..",
        //         onCancel: NULL_FUNCTION,
        //         type: 'warning',
        //         onAccept: () => this.props.onArchived(repoDocInfos),
        //     });

        return {

            onRename,
            onDeleted,
            onTagged,
            onOpen: () => actions.onOpen(first()!),
            onShowFile: () => actions.onShowFile(first()!),
            onCopyOriginalURL: () => actions.onCopyOriginalURL(first()!),
            onCopyFilePath: () => actions.onCopyFilePath(first()!),
            onCopyDocumentID: () => actions.onCopyDocumentID(first()!),
            onArchived: () => actions.onArchived(this.selectedProvider(), false),
            onFlagged: () => actions.onFlagged(this.selectedProvider(), false),
            onDropped,
            onTagSelected: actions.onTagSelected,
            onDragStart,
            onDragEnd,
        };

    }

    private createActions(): IDocRepoActions {

        // TODO: this should be refactored to use tags even in the TreeState
        const onTagSelected = (tagLiterals: ReadonlyArray<string>) => {

            const tags = this.props.tagsProvider();

            const tagsMap = arrayStream(tags).toMap(current => current.id);

            const filteredTags = arrayStream(tagLiterals)
                .map(current => tagsMap[current])
                .filter(current => isPresent(current))
                .collect();

            const isRootTag = () => {
                return filteredTags.length === 1 && filteredTags[0].id === '/';
            };

            if (isRootTag()) {
                this.setFilters({...this.state.filters, tags: []});
            } else {
                this.setFilters({...this.state.filters, tags: filteredTags});
            }

        };

        return {
            ...defaultActions,
            selectedProvider: this.selectedProvider,
            selectRow: this.selectRow,
            setPage: this.setPage,
            setRowsPerPage: this.setRowsPerPage,
            setSelected: this.setSelected,
            setFilters: this.setFilters,
            setSort: this.setSort,
            onTagSelected
        };
    }

    public render() {

        const store: IDocRepoStore = {
            data: this.state.data,
            view: this.state.view,
            viewPage: this.state.viewPage,
            columns: this.state.columns,
            selected: this.state.selected,
            order: this.state.order,
            orderBy: this.state.orderBy,
            page: this.state.page,
            rowsPerPage: this.state.rowsPerPage,
            filters: this.state.filters
        };

        const folderStore: IDocRepoFolderStore = {
            treeState: this.state.treeState,
            sidebarFilter: this.state.sidebarFilter,
            setSidebarFilter: this.setSidebarFilter
        }

        // FIXME: what if instead of having the functions with the data, that
        // I just had nested contexts providing the functions.  The funcitons
        // themselves would only have setState and we can use nested functions
        // by having them call an earlier component level.

        // it would be nice to share functions like setFilters not just setState

        // no actions.. just use delegate... no nesting... only thing we export
        // is the store, and callbacks that would mutate the state.
        //
        // the reason to split up the callbacks and the store is that most of
        // the time the callbacks are immuntable...
        //
        // I could use multiple objects but use a 'ref' or provider to access
        // the underlying state... basically I could/would use a functional
        // component BUT I can create the ref, and state, and share it as
        // context and really ANY sub-component could mutate the same state
        //
        // I coudl create a new Store object that has an internal ref and a
        // setState object... the only thing exposed would be the value, and
        // setState...
        //
        // - the main thing this wouldn't solve very well is components that
        //   selectively access various bits of the state...

        // context store... it's just using ref and state and then we setup
        // a subcomponent that defines its own context, with one functions to
        // access ot.


        return (
            <MUIDialogControllerContext.Consumer>
                {dialogs => {
                    this.dialogs = dialogs;

                    return (
                        <DocRepoStoreContext.Provider value={store}>
                            <DocRepoActionsContext.Provider value={this.actions}>
                                <DocRepoCallbacksContext.Provider value={this.callbacks}>
                                    <DocRepoFolderStoreContext.Provider value={folderStore}>
                                        {this.props.children}
                                    </DocRepoFolderStoreContext.Provider>
                                </DocRepoCallbacksContext.Provider>
                            </DocRepoActionsContext.Provider>
                        </DocRepoStoreContext.Provider>
                    );

                }}
            </MUIDialogControllerContext.Consumer>

        );

    }

}

