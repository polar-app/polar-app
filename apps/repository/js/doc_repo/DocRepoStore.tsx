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
import {Preconditions} from "polar-shared/src/Preconditions";
import {Debouncers} from "polar-shared/src/util/Debouncers";
import {SelectRowType} from "./DocRepoScreen";
import {Numbers} from "polar-shared/src/util/Numbers";
import {Arrays} from "polar-shared/src/util/Arrays";
import {SetArrays} from "polar-shared/src/util/SetArrays";
import {
    Callback,
    Callback1,
    NULL_FUNCTION
} from "polar-shared/src/util/Functions";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Mappers} from "polar-shared/src/util/Mapper";

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

export interface IDocRepoActions {

    readonly selectedProvider: Provider<ReadonlyArray<RepoDocInfo>>;

    readonly selectRow: (selectedIdx: number,
                         event: React.MouseEvent,
                         type: SelectRowType) => void;

    readonly setPage: (page: number) => void;

    // FIXME: not sure if these are actually needed or we can use Callbacks
    // here...
    readonly onTagged: Callback1<ReadonlyArray<RepoDocInfo>>;
    readonly onOpen: Callback1<RepoDocInfo>;
    readonly onRename: Callback1<RepoDocInfo>;
    readonly onShowFile: Callback1<RepoDocInfo>;
    readonly onCopyOriginalURL: Callback1<RepoDocInfo>;
    readonly onCopyFilePath: Callback1<RepoDocInfo>;
    readonly onCopyDocumentID: Callback1<RepoDocInfo>;
    readonly onDeleted: (repoDocInfos: ReadonlyArray<RepoDocInfo>) => void;
    readonly onArchived: Callback1<ReadonlyArray<RepoDocInfo>>;
    readonly onFlagged: Callback1<ReadonlyArray<RepoDocInfo>>;


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

const initialActions: IDocRepoActions = {
    selectRow: NULL_FUNCTION,
    selectedProvider: () => [],

    setPage: NULL_FUNCTION,

    onTagged: tracer('onTagged'),
    onOpen: tracer('onOpen'),
    onRename: tracer('onRename'),
    onShowFile: tracer('onShowFile'),
    onCopyOriginalURL: tracer('onCopyOriginalURL'),
    onCopyFilePath: tracer('onCopyFilePath'),
    onCopyDocumentID: tracer('onCopyDocumentID'),
    onDeleted: tracer('onDeleted'),
    onArchived: tracer('onArchived'),
    onFlagged: tracer('onFlagged'),
}

const initialCallbacks: IDocRepoCallbacks = {
    onTagged: tracer('onTagged'),
    onOpen: tracer('onOpen'),
    onRename: tracer('onRename'),
    onShowFile: tracer('onShowFile'),
    onCopyOriginalURL: tracer('onCopyOriginalURL'),
    onCopyFilePath: tracer('onCopyFilePath'),
    onCopyDocumentID: tracer('onCopyDocumentID'),
    onDeleted: tracer('onDeleted'),
    onArchived: tracer('onArchived'),
    onFlagged: tracer('onFlagged'),
}

export const DocRepoStoreContext = React.createContext<IDocRepoStore>(initialStore)

export const DocRepoActionsContext = React.createContext<IDocRepoActions>(initialActions)

export const DocRepoCallbacksContext = React.createContext<IDocRepoCallbacks>(initialCallbacks)

export function useDocRepoStore() {
    return React.useContext(DocRepoStoreContext);
}

export function useDocRepoActions() {
    return React.useContext(DocRepoActionsContext);
}

export function useDocRepoCallbacks() {
    return React.useContext(DocRepoCallbacksContext);
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

    readonly children: React.ReactNode;
}

/**
 * Apply a reducer a temporary state, to compute the effective state.
 */
function reduce(tmpState: IDocRepoStore): IDocRepoStore {

    // compute the view, then the viewPage

    console.log("FIXME: working with tmpState: ", tmpState);

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

    constructor(props: Readonly<IProps>) {
        super(props);

        this.state = {...initialStore};

        this.doUpdate = this.doUpdate.bind(this);
        this.doReduceAndUpdateState = this.doReduceAndUpdateState.bind(this);
        this.selectRow = this.selectRow.bind(this);
        this.selectedProvider = this.selectedProvider.bind(this);
        this.setPage = this.setPage.bind(this);

        // the debouncer here is VERY important... otherwise we lock up completely
        this.eventListener = Debouncers.create(() => {
            this.doUpdate();
        });

    }

    public componentDidMount(): void {
        const {repoDocMetaLoader} = this.props;
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


    private createCallbacks(actions: IDocRepoActions): IDocRepoCallbacks {

        const first = () => {
            const selected = this.selectedProvider();
            return selected.length >= 1 ? selected[0] : undefined
        }

        return {

            onOpen: () => actions.onOpen(first()!),
            onRename: () => actions.onRename(first()!),
            onShowFile: () => actions.onShowFile(first()!),
            onCopyOriginalURL: () => actions.onCopyOriginalURL(first()!),
            onCopyFilePath: () => actions.onCopyFilePath(first()!),
            onCopyDocumentID: () => actions.onCopyDocumentID(first()!),
            onDeleted: () => actions.onDeleted(this.selectedProvider()),
            onArchived: () => actions.onArchived(this.selectedProvider()),
            onFlagged: () => actions.onFlagged(this.selectedProvider()),
            onTagged: () => actions.onTagged(this.selectedProvider()),

        };

    }


    public render() {

        const {repoDocMetaLoader, repoDocMetaManager} = this.props;

        const store: IDocRepoStore = {
            ...this.state,
        };

        const actions: IDocRepoActions = {
            ...initialActions,
            selectedProvider: this.selectedProvider,
            selectRow: this.selectRow,
            setPage: this.setPage
        };

        const callbacks = this.createCallbacks(actions);

        return (
            <DocRepoStoreContext.Provider value={store}>
                <DocRepoActionsContext.Provider value={actions}>
                    <DocRepoCallbacksContext.Provider value={callbacks}>
                        {this.props.children}
                    </DocRepoCallbacksContext.Provider>
                </DocRepoActionsContext.Provider>
            </DocRepoStoreContext.Provider>
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

                if (selected.includes(selectedIdx)) {
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

        const doStrategy = (): SelectedRows | undefined => {

            const strategy = computeStrategy();

            switch (strategy) {
                case "one":
                    return doStrategyOne();
                case "range":
                    return doStrategyRange();
                case "toggle":
                    return doStrategyToggle();
                case "none":
                    return undefined;
            }

        };

        return doStrategy();

    }
}
