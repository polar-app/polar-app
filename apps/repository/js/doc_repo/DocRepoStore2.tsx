import {createObservableStore} from "../../../../web/spectron0/material-ui/store/ObservableStore";
import {RepoDocInfo} from "../RepoDocInfo";
import {
    DocRepoTableColumns,
    DocRepoTableColumnsMap
} from "./DocRepoTableColumns";
import {Sorting} from "../../../../web/spectron0/material-ui/doc_repo_table/Sorting";
import {DocRepoFilters2} from "./DocRepoFilters2";
import React from "react";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Tag, Tags} from "polar-shared/src/tags/Tags";
import {IDMaps} from "polar-shared/src/util/IDMaps";
import {SelectRowType} from "./DocRepoScreen";
import {Provider} from "polar-shared/src/util/Providers";
import {TableSelection} from "./TableSelection";
import {Mappers} from "polar-shared/src/util/Mapper";
import {RepoDocMetaManager} from "../RepoDocMetaManager";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {DraggingSelectedDocs} from "./SelectedDocs";
import {MUITagInputControls} from "../MUITagInputControls";
import {AutocompleteDialogProps} from "../../../../web/js/ui/dialogs/AutocompleteDialog";
import {useDialogManager} from "../../../../web/spectron0/material-ui/dialogs/MUIDialogControllers";
import {DialogManager} from "../../../../web/spectron0/material-ui/dialogs/MUIDialogController";
import {
    IPersistence,
    usePersistence,
    useRepoDocMetaLoader,
    useRepoDocMetaManager,
    useTagsProvider
} from "../persistence_layer/PersistenceLayerApp";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../../../web/js/hooks/lifecycle";
import {Preconditions} from "polar-shared/src/Preconditions";
import {Debouncers} from "polar-shared/src/util/Debouncers";
import {Logger} from "polar-shared/src/logger/Logger";
import {BackendFileRefs} from "../../../../web/js/datastore/BackendFileRefs";
import {Either} from "../../../../web/js/util/Either";
import {SynchronizingDocLoader} from "../util/SynchronizingDocLoader";
import {Clipboards} from "../../../../web/js/util/system/clipboard/Clipboards";
import {Directories} from "../../../../web/js/datastore/Directories";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {shell} from "electron";
import {Optional} from "polar-shared/src/util/ts/Optional";

const log = Logger.create();

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

    /**
     * Only used to trigger a store refresh.  This is not strictly necessary
     * but might in the future if we want to FORCE a refresh for some reason.
     */
    readonly _refresh: number;
    
}

interface IDocRepoCallbacks {

    // *** UI operations that dont actually modify data
    readonly selectedProvider: Provider<ReadonlyArray<RepoDocInfo>>;

    readonly selectRow: (selectedIdx: number,
                         event: React.MouseEvent,
                         type: SelectRowType) => void;

    readonly setPage: (page: number) => void;
    readonly setRowsPerPage: (rowsPerPage: number) => void;
    readonly setSelected: (selected: ReadonlyArray<number>) => void;
    readonly setFilters: (filters: DocRepoFilters2.Filters) => void;
    readonly setSort: (order: Sorting.Order, orderBy: keyof RepoDocInfo) => void;

    // *** actual actions that manipulate the backend
    readonly doTagged: (repoDocInfos: ReadonlyArray<RepoDocInfo>, tags: ReadonlyArray<Tag>) => void;
    readonly doOpen: (repoDocInfo: RepoDocInfo) => void;
    readonly doRename: (repoDocInfo: RepoDocInfo, title: string) => void;
    readonly doShowFile: (repoDocInfo: RepoDocInfo) => void;
    readonly doCopyOriginalURL: (repoDocInfo: RepoDocInfo) => void;
    readonly doCopyFilePath: (repoDocInfo: RepoDocInfo) => void;
    readonly doCopyDocumentID: (repoDocInfo: RepoDocInfo) => void;
    readonly doDeleted: (repoDocInfos: ReadonlyArray<RepoDocInfo>) => void;
    readonly doArchived: (repoDocInfos: ReadonlyArray<RepoDocInfo>, archived: boolean) => void;
    readonly doFlagged: (repoDocInfos: ReadonlyArray<RepoDocInfo>, flagged: boolean) => void;


    readonly doDropped: (repoDocInfos: ReadonlyArray<RepoDocInfo>, tag: Tag) => void;

    // ** callbacks that might need prompts, confirmation, etc.
    readonly onTagged: () => void;
    readonly onOpen: () => void;
    readonly onRename: () => void;
    readonly onShowFile: () => void;
    readonly onCopyOriginalURL: () => void;
    readonly onCopyFilePath: () => void;
    readonly onCopyDocumentID: () => void;
    readonly onDeleted: () => void;
    readonly onArchived: () => void;
    readonly onFlagged: () => void;

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

// the default state of the store...
const docRepoStore: IDocRepoStore = {
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
    _refresh: 0
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

//
// FIXME might neeed a new object type... mutator... which we can give to the
// callbacks object so that it can mutate the store without using hooks.

interface Mutator {
    setDataProvider: (dataProvider: DataProvider) => void;
    refresh: () => void;
    doReduceAndUpdateState: (newStore: IDocRepoStore) => void;
}

type DataProvider = Provider<ReadonlyArray<RepoDocInfo>>;

function mutatorFactory(storeProvider: Provider<IDocRepoStore>,
                        setStore: (store: IDocRepoStore) => void) {

    let dataProvider: DataProvider = () => [];

    function doReduceAndUpdateState(tmpState: IDocRepoStore) {

        setTimeout(() => {
            const newState = reduce({...tmpState});
            setStore(newState);
        }, 1)

    }

    /**
     * Fetch the latest values from the repoDocMetaManager, then reduce, and
     * apply state.
     */
    function refresh() {
        const store = storeProvider();
        setTimeout(() => {
            const data = dataProvider();
            doReduceAndUpdateState({...store, data});
        }, 1);
    }

    function setDataProvider(newDataProvider: DataProvider) {
        dataProvider = newDataProvider;
    }

    return {
        doReduceAndUpdateState,
        refresh,
        setDataProvider
    };

}

function createCallbacks(storeProvider: Provider<IDocRepoStore>,
                         setStore: (store: IDocRepoStore) => void,
                         mutator: Mutator,
                         repoDocMetaManager: RepoDocMetaManager,
                         tagsProvider: () => ReadonlyArray<Tag>,
                         dialogs: DialogManager,
                         persistence: IPersistence): IDocRepoCallbacks {

    const synchronizingDocLoader
        = new SynchronizingDocLoader(persistence.persistenceLayerProvider);

    function firstSelected() {
        const selected = selectedProvider();
        return selected.length >= 1 ? selected[0] : undefined
    }

    function copyText(text: string, message?: string) {
        Clipboards.getInstance().writeText(text)

        if (message) {
            dialogs.snackbar({message});
        }

    }

    async function batchMutator<T>(promises: ReadonlyArray<Promise<T>>) {

        for (const promise of promises) {
            // TODO update progress of this operation using a snackbar
            await promise;
        }

        mutator.refresh();

    }

    function selectRow(selectedIdx: number,
                       event: React.MouseEvent,
                       type: SelectRowType) {

        const store = storeProvider();

        const selected = TableSelection.selectRow(selectedIdx,
            event,
            type,
            store.selected);

        setStore({
            ...store,
            selected: selected || []
        });

    }

    function selectedProvider(): ReadonlyArray<RepoDocInfo> {

        const store = storeProvider();

        return arrayStream(store.selected)
            .map(current => store.view[current])
            .collect();
    }

    function setPage(page: number) {

        const store = storeProvider();

        mutator.doReduceAndUpdateState({
            ...store,
            page,
            selected: []
        });
    }

    function setRowsPerPage(rowsPerPage: number) {
        const store = storeProvider();

        mutator.doReduceAndUpdateState({
            ...store,
            rowsPerPage,
            page: 0,
            selected: []
        });
    }

    function setSelected(selected: ReadonlyArray<number>) {
        const store = storeProvider();

        setStore({
            ...store,
            selected
        });
    }

    function setFilters(filters: DocRepoFilters2.Filters) {
        const store = storeProvider();

        mutator.doReduceAndUpdateState({
            ...store,
            filters,
            page: 0,
            selected: []
        });
    }

    function setSort(order: Sorting.Order, orderBy: keyof RepoDocInfo) {
        const store = storeProvider();

        mutator.doReduceAndUpdateState({
            ...store,
            order,
            orderBy,
            page: 0,
            selected: []
        });

    }

    // public setSidebarFilter(sidebarFilter: string) {
    //     const store = store.current;
    //
    //     setStore({...store, sidebarFilter});
    // }
    //

    // **** action / mutators

    function doTagged(repoDocInfos: ReadonlyArray<RepoDocInfo>, tags: ReadonlyArray<Tag>): void {

        function toPromise(repoDocInfo: RepoDocInfo) {
            return repoDocMetaManager!.writeDocInfoTags(repoDocInfo, tags);
        }

        batchMutator(repoDocInfos.map(toPromise))
            .catch(err => log.error(err));

    }

    function doArchived(repoDocInfos: ReadonlyArray<RepoDocInfo>, archived: boolean): void {

        const toPromise = (repoDocInfo: RepoDocInfo) => {
            repoDocInfo.archived = archived;
            repoDocInfo.docInfo.archived = archived;
            return this.props.writeDocInfo(repoDocInfo.docInfo)
        }

        async function doHandle() {
            await batchMutator(repoDocInfos.map(toPromise));
            dialogs.snackbar({message: "Documents successfully archived"});
        }

        doHandle()
            .catch(err => log.error(err));

    }

    function doFlagged(repoDocInfos: ReadonlyArray<RepoDocInfo>, flagged: boolean): void {
        const toPromise = (repoDocInfo: RepoDocInfo) => {
            repoDocInfo.archived = flagged;
            repoDocInfo.docInfo.archived = flagged;
            return this.props.writeDocInfo(repoDocInfo.docInfo)
        }

        async function doHandle() {
            await batchMutator(repoDocInfos.map(toPromise));
            dialogs.snackbar({message: "Documents successfully flagged"});
        }

        doHandle()
            .catch(err => log.error(err));

    }

    function doCopyDocumentID(repoDocInfo: RepoDocInfo): void {
        const text = repoDocInfo.fingerprint;

        copyText(text, "Document ID copied to clipboard");
    }

    function doCopyFilePath(repoDocInfo: RepoDocInfo): void {

        function toText() {
            const directories = new Directories();
            const filename = repoDocInfo.filename!;
            return FilePaths.join(directories.stashDir, filename);
        }

        const text = toText();
        copyText(text, "File path copied to clipboard");

    }

    function doCopyOriginalURL(repoDocInfo: RepoDocInfo): void {

        function toText() {
            return repoDocInfo.url!;
        }

        const text = toText();
        copyText(text, "URL copied to clipboard");

    }

    function doDeleted(repoDocInfos: ReadonlyArray<RepoDocInfo>): void {
        // noop
        // FIXME
    }

    function doDropped(repoDocInfos: ReadonlyArray<RepoDocInfo>, tag: Tag): void {
        // this basically tags the document.
        doTagged(repoDocInfos, [tag]);
    }

    function doOpen(repoDocInfo: RepoDocInfo): void {

        const fingerprint = repoDocInfo.fingerprint;

        const docInfo = repoDocInfo.docInfo;
        const backendFileRef = BackendFileRefs.toBackendFileRef(Either.ofRight(docInfo));

        synchronizingDocLoader.load(fingerprint, backendFileRef!)
            .catch(err => log.error("Unable to load doc: ", err));

    }

    function doRename(repoDocInfo: RepoDocInfo, title: string): void {

        async function doHandle() {
            await repoDocMetaManager.writeDocInfoTitle(repoDocInfo, title);
            mutator.refresh();
        }

        doHandle()
            .catch(err => log.error("Could not write doc title: ", err));

    }

    function doShowFile(repoDocInfo: RepoDocInfo): void {
        const filename = repoDocInfo.filename!;
        const directories = new Directories();
        const path = FilePaths.join(directories.stashDir, filename);
        shell.showItemInFolder(path);
    }

    // **** event handlers

    function onArchived() {

        const repoDocInfos = selectedProvider();

        if (repoDocInfos.length === 0) {
            return;
        }

        if (repoDocInfos.length === 1) {
            const repoDocInfo = repoDocInfos[0];
            doArchived(repoDocInfos, ! repoDocInfo.archived);
            return;
        }

        dialogs.confirm({
            title: "Are you sure you want to archive these document(s)?",
            subtitle: "They won't be deleted but will be hidden by default.",
            onCancel: NULL_FUNCTION,
            type: 'warning',
            onAccept: () => doArchived(repoDocInfos, true),
        });

    }

    function onCopyDocumentID(): void {
        Optional.of(firstSelected()).map(doCopyDocumentID);
    }

    function onCopyFilePath(): void {
        Optional.of(firstSelected()).map(doCopyFilePath);
    }

    function onCopyOriginalURL(): void {
        Optional.of(firstSelected()).map(doCopyOriginalURL);
    }

    function onFlagged(): void {

        const repoDocInfos = selectedProvider();

        if (repoDocInfos.length === 0) {
            return;
        }

        if (repoDocInfos.length === 1) {
            const repoDocInfo = repoDocInfos[0];
            doFlagged(repoDocInfos, ! repoDocInfo.flagged);
            return;
        }

        dialogs.confirm({
            title: "Are you sure you want to flag these document(s)?",
            subtitle: "Flagging will allow these documents to stand out and prioritized among your other documents.",
            onCancel: NULL_FUNCTION,
            type: 'warning',
            onAccept: () => doFlagged(repoDocInfos, true),
        });

    }

    function onOpen(): void {
        doOpen(firstSelected()!);
    }

    function onShowFile(): void {
        doShowFile(firstSelected()!);
    }

    function onTagSelected(filteredTags: ReadonlyArray<string>): void {

        const store = storeProvider();
        const tags = Tags.lookup(tagsProvider(), filteredTags);

        setFilters({...store.filters, tags});

    }

    function onDragStart(event: React.DragEvent) {

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

        const selected = selectedProvider();
        DraggingSelectedDocs.set(selected);

    }

    function onDragEnd() {
        console.log("onDragEnd");
        DraggingSelectedDocs.clear();
    }

    function onDropped(tag: Tag) {
        const dragged = DraggingSelectedDocs.get();
        if (dragged) {
            doDropped(dragged, tag);
        }
    }

    function onRename() {

        const repoDocInfo = firstSelected()!;

        dialogs.prompt({
            title: "Enter a new title for the document:",
            defaultValue: repoDocInfo.title,
            onCancel: NULL_FUNCTION,
            onDone: (value) => doRename(repoDocInfo, value)
        });

    }

    function onDeleted() {

        const repoDocInfos = selectedProvider();

        if (repoDocInfos.length === 0) {
            // no work to do
            return;
        }

        dialogs.confirm({
            title: "Are you sure you want to delete these item(s)?",
            subtitle: "This is a permanent operation and can't be undone.  ",
            type: 'danger',
            onAccept: () => doDeleted(repoDocInfos),
        });

    }

    function onTagged() {

        const repoDocInfos = selectedProvider();

        if (repoDocInfos.length === 0) {
            // no work to do
            return;
        }

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
            onDone: tags => doTagged(repoDocInfos, tags)
        };

        dialogs.autocomplete(autocompleteProps);

    }

    // I don't know of a better way to return / organize the callbacks here
    // and think this is a bit ugly but I can't think of a better way to handle
    // this.

    return {

        selectedProvider,

        selectRow,
        setPage,
        setRowsPerPage,
        setSelected,
        setFilters,
        setSort,

        doTagged,
        doOpen,
        doRename,
        doShowFile,
        doCopyOriginalURL,
        doCopyFilePath,
        doCopyDocumentID,
        doDeleted,
        doArchived,
        doFlagged,

        doDropped,

        onTagged,
        onOpen,
        onRename,
        onShowFile,
        onCopyOriginalURL,
        onCopyFilePath,
        onCopyDocumentID,
        onDeleted,
        onArchived,
        onFlagged,

        onDragStart,
        onDragEnd,
        onDropped,
        onTagSelected,

    };

}

const callbacksFactory = (storeProvider: Provider<IDocRepoStore>,
                          setStore: (store: IDocRepoStore) => void,
                          mutator: Mutator): IDocRepoCallbacks => {

    const dialogs = useDialogManager();
    const repoDocMetaManager = useRepoDocMetaManager();
    const tagsProvider = useTagsProvider();
    const persistence = usePersistence();

    return createCallbacks(storeProvider,
        setStore, mutator, repoDocMetaManager, tagsProvider, dialogs, persistence);

}

// FIXME: I want to rework this so that, untilyou use the provider DocRepoStoreProvider,
// a MOCK object is returned... mock/proxy objects would be great here..

export const [DocRepoStoreProvider, useDocRepoStore, useDocRepoCallbacks, docRepoMutator]
    = createObservableStore<IDocRepoStore, Mutator, IDocRepoCallbacks>(docRepoStore, mutatorFactory, callbacksFactory);

interface IProps {
    readonly children: JSX.Element;
}

export const DocRepoStore2 = React.memo((props: IProps) => {

    const repoDocMetaLoader = useRepoDocMetaLoader();
    const repoDocMetaManager = useRepoDocMetaManager();

    const doRefresh = React.useCallback(Debouncers.create(() => {
        docRepoMutator.refresh();
    }), []);

    useComponentDidMount(() => {
        docRepoMutator.setDataProvider(() => repoDocMetaManager.repoDocInfoIndex.values());
        doRefresh();
        repoDocMetaLoader.addEventListener(doRefresh)
    });

    useComponentWillUnmount(() => {

        Preconditions.assertCondition(repoDocMetaLoader.removeEventListener(doRefresh),
            "Failed to remove event listener");
    });

    return (
        <DocRepoStoreProvider>
            {props.children}
        </DocRepoStoreProvider>
    )

});
