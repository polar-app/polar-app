import {RepoDocInfo} from "../RepoDocInfo";
import {
    DocRepoTableColumns,
    DocRepoTableColumnsMap
} from "./DocRepoTableColumns";
import React, {useEffect, createContext} from "react";
import {IDMaps} from "polar-shared/src/util/IDMaps";
import {Sorting} from "../../../../web/spectron0/material-ui/doc_repo_table/Sorting";
import {Provider} from "polar-shared/src/util/Providers";
import {RepoDocMetaLoader} from "../RepoDocMetaLoader";
import {RepoDocMetaManager} from "../RepoDocMetaManager";
import {DocRepoFilters2} from "./DocRepoFilters2";
import {Preconditions, isPresent} from "polar-shared/src/Preconditions";
import {Debouncers} from "polar-shared/src/util/Debouncers";
import {SelectRowType} from "./DocRepoScreen";
import {Numbers} from "polar-shared/src/util/Numbers";
import {Arrays} from "polar-shared/src/util/Arrays";
import {SetArrays} from "polar-shared/src/util/SetArrays";
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
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";

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


    readonly onDropped: (repoDocInfos: ReadonlyArray<RepoDocInfo>, tag: TagDescriptor) => void;
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

    readonly onDragStart: (event: DragEvent) => void;
    readonly onDragEnd: () => void;

    /**
     * Called when an doc is actually dropped on a tag.
     */
    readonly onDropped: (tag: TagDescriptor) => void;

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
    return (arg?: any) => console.info(name, arg);
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

export function useDocRepoStore() {
    return useContextMemo(DocRepoStoreContext);
}

export function useDocRepoActions() {
    return useContextMemo(DocRepoActionsContext);
}

export function useDocRepoCallbacks() {
    return useContextMemo(DocRepoCallbacksContext);
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


export class DocRepoStore extends React.Component<IProps, IDocRepoStore> {

    private eventListener: Callback = NULL_FUNCTION;
    private callbacks: IDocRepoCallbacks;
    private actions: IDocRepoActions;
    private dialogs: DialogManager | undefined;

    constructor(props: Readonly<IProps>) {
        super(props);

        this.state = {...initialStore};

        this.doUpdate = this.doUpdate.bind(this);
        this.doReduceAndUpdateState = this.doReduceAndUpdateState.bind(this);
        this.selectRow = this.selectRow.bind(this);
        this.selectedProvider = this.selectedProvider.bind(this);
        this.setPage = this.setPage.bind(this);
        this.setRowsPerPage = this.setRowsPerPage.bind(this);
        this.setSelected = this.setSelected.bind(this);
        this.setFilters = this.setFilters.bind(this);
        this.setSort = this.setSort.bind(this);

        // the debouncer here is VERY important... otherwise we lock up completely
        this.eventListener = Debouncers.create(() => {
            this.doUpdate();
        });

        this.actions = this.createActions();
        this.callbacks = this.createCallbacks(this.actions);

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

        const selected = Callbacks.selectRow(selectedIdx,
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
        this.doReduceAndUpdateState({...this.state, filters});
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

    private createCallbacks(actions: IDocRepoActions): IDocRepoCallbacks {

        const first = () => {
            const selected = this.selectedProvider();
            return selected.length >= 1 ? selected[0] : undefined
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
            onDragStart: defaultCallbacks.onDragStart,
            onDragEnd: defaultCallbacks.onDragEnd,
            onDropped: defaultCallbacks.onDropped,
            onTagSelected: actions.onTagSelected
        };

    }

    private createActions(): IDocRepoActions {

        // TODO: this should be refactored
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
            ...this.state,
        };

        // FIXME: all the callbacks here will be updated too I think and that is
        // going to cause us to rerender menu items too.. which freaking sucks

        // FIXME: now the main problem is that we ahve to rewrite the actions
        // and the callbacks BUT:
        //
        //
        // - when state is open we ONLY want to trigger components that need
        //   to be re-rendered - not smaller components that listen to the
        //   callbacks
        //
        //  - we can't access getSelected easily...
        //
        //  - callbacks are created EACH render which isn't efficient...

        //  - I don't have an EASY way to to get access to dialogs...
        //
        //  - If I use react.useMemo that might work if I have a smaller
        //    set of 1-2 root components which then call the store...

        // FIXME: I'm giving it callbacks but they're already created and we're
        // changing the actions but they're already wired up...
        //
        //
        //
        // rework it like this:

        // create initial actions in the root, copied from the defaults...
        // then augment them down the line, copying them from context...

        // FIXME: another idea is to just use the dialog context directly...
        // and a render prop and then update a global variable... then use
        // those dialogs directly

        return (
            <MUIDialogControllerContext.Consumer>
                {dialogs => {
                    this.dialogs = dialogs;

                    return (
                        <DocRepoStoreContext.Provider value={store}>
                            <DocRepoActionsContext.Provider value={this.actions}>
                                <DocRepoCallbacksContext.Provider value={this.callbacks}>
                                    {this.props.children}
                                </DocRepoCallbacksContext.Provider>
                            </DocRepoActionsContext.Provider>
                        </DocRepoStoreContext.Provider>
                    )

                }}
            </MUIDialogControllerContext.Consumer>

        );

    }

}

// FIXME: move this outside this classs..
namespace Callbacks {

    export function selectRow(selectedIdx: number,
                              event: React.MouseEvent,
                              type: SelectRowType,
                              selected: ReadonlyArray<number>) {

        selectedIdx = Numbers.toNumber(selectedIdx);

        // there are really only three strategies
        //
        // - one: select ONE item and unselect the previous item(s).  This is done when we have
        //        a single click on an item.  It always selects it and never de-selects it.
        //
        // - add the new selectedIndex to the list of currently selected items.
        //
        //   - FIXME: really what this is is just select-one but we leave the
        //     previous items in place and perform no mutation on them...

        // - toggle: used when the type is 'checkbox' because we're only toggling
        //   the selection of that one item
        //
        // - none: do nothing.  this is used when the context menu is being used and no additional
        //         items are being changed.

        type SelectionStrategy = 'one' | 'range' | 'toggle' | 'none';

        type SelectedRows = ReadonlyArray<number>;

        const computeStrategy = (): SelectionStrategy => {

            if (type === 'checkbox') {
                return 'toggle';
            }

            if (type === 'click') {

                if (event.getModifierState("Shift")) {
                    return 'range';
                }

                if (event.getModifierState("Control") || event.getModifierState("Meta")) {
                    return 'toggle';
                }

            }

            if (type === 'context') {
                console.log("FIXME1: ", selected, selectedIdx);

                if (selected.includes(selectedIdx)) {
                    console.log("FIXME2: ");
                    return 'none';
                }

            }

            return 'one';

        };

        const doStrategyRange = (): SelectedRows => {

            // select a range

            let min: number = 0;
            let max: number = 0;

            if (selected.length > 0) {
                const sorted = [...selected].sort((a, b) => a - b);
                min = Arrays.first(sorted)!;
                max = Arrays.last(sorted)!;
            }

            return [...Numbers.range(Math.min(min, selectedIdx),
                                     Math.max(max, selectedIdx))];

        };

        const doStrategyToggle = (): SelectedRows => {

            if (selected.includes(selectedIdx)) {
                return SetArrays.difference(selected, [selectedIdx]);
            } else {
                return SetArrays.union(selected, [selectedIdx]);
            }

        };

        const doStrategyOne = (): SelectedRows => {
            return [selectedIdx];
        };

        const doStrategy = (): SelectedRows => {

            const strategy = computeStrategy();

            switch (strategy) {
                case "one":
                    return doStrategyOne();
                case "range":
                    return doStrategyRange();
                case "toggle":
                    return doStrategyToggle();
                case "none":
                    return selected;
            }

        };

        return doStrategy();

    }
}
