import {
    createObservableStore,
    ObservableStore
} from "../../../../web/spectron0/material-ui/store/ObservableStore";
import {RepoDocInfo} from "../RepoDocInfo";
import {
    DocRepoTableColumns,
    DocRepoTableColumnsMap
} from "./DocRepoTableColumns";
import {Sorting} from "../../../../web/spectron0/material-ui/doc_repo_table/Sorting";
import {DocRepoFilters2} from "./DocRepoFilters2";
import React from "react";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Tag} from "polar-shared/src/tags/Tags";
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
    readonly doTagSelected: (tags: ReadonlyArray<string>) => void;

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

class DocRepoCallbacks implements IDocRepoCallbacks {

    constructor(private readonly repoDocMetaManager: RepoDocMetaManager,
                private readonly tagsProvider: () => ReadonlyArray<Tag>,
                private readonly store: ObservableStore<IDocRepoStore>,
                private readonly setStore: (store: IDocRepoStore) => void) {

    }

    private first() {
        const selected = this.selectedProvider();
        return selected.length >= 1 ? selected[0] : undefined
    }

    private doReduceAndUpdateState(tmpState: IDocRepoStore) {

        setTimeout(() => {
            const newState = reduce({...tmpState});
            this.setStore(newState);
        }, 1)

    };

    private doUpdate() {

        setTimeout(() => {
            const data = this.repoDocMetaManager.repoDocInfoIndex.values();
            this.doReduceAndUpdateState({...this.store.current, data});
        }, 1);

    }

    public selectRow(selectedIdx: number,
                     event: React.MouseEvent,
                     type: SelectRowType) {

        const store = this.store.current;

        const selected = TableSelection.selectRow(selectedIdx,
            event,
            type,
            store.selected);

        this.setStore({
            ...store,
            selected: selected || []
        });

    }

    public selectedProvider(): ReadonlyArray<RepoDocInfo> {

        const store = this.store.current;

        return arrayStream(store.selected)
            .map(current => store.view[current])
            .collect();
    };

    public setPage(page: number) {

        const store = this.store.current;

        this.doReduceAndUpdateState({
            ...store,
            page,
            selected: []
        });
    };

    public setRowsPerPage(rowsPerPage: number) {
        const store = this.store.current;

        this.doReduceAndUpdateState({
            ...store,
            rowsPerPage,
            page: 0,
            selected: []
        });
    };

    public setSelected(selected: ReadonlyArray<number>) {

        const store = this.store.current;

        this.setStore({
            ...store,
            selected
        });
    }

    public setFilters(filters: DocRepoFilters2.Filters) {
        const store = this.store.current;
        this.doReduceAndUpdateState({
            ...store,
            filters,
            page: 0,
            selected: []
        });
    }

    public setSort(order: Sorting.Order, orderBy: keyof RepoDocInfo) {

        const store = this.store.current;

        this.doReduceAndUpdateState({
            ...store,
            order,
            orderBy,
            page: 0,
            selected: []
        });

    }



    // public setSidebarFilter(sidebarFilter: string) {
    //     const store = this.store.current;
    //
    //     this.setStore({...store, sidebarFilter});
    // }
    //

    // **** action / mutators

    public doTagged(repoDocInfos: ReadonlyArray<RepoDocInfo>, tags: ReadonlyArray<Tag>): void {
        // noop
    }

    public doArchived(repoDocInfos: ReadonlyArray<RepoDocInfo>, archived: boolean): void {
        // noop
    }

    public doCopyDocumentID(repoDocInfo: RepoDocInfo): void {
        // noop
    }

    public doCopyFilePath(repoDocInfo: RepoDocInfo): void {
        // noop
    }

    public doCopyOriginalURL(repoDocInfo: RepoDocInfo): void {
        // noop
    }

    public doDeleted(repoDocInfos: ReadonlyArray<RepoDocInfo>): void {
        // noop
    }

    public doDropped(repoDocInfos: ReadonlyArray<RepoDocInfo>, tag: Tag): void {
        // noop
    }

    public doFlagged(repoDocInfos: ReadonlyArray<RepoDocInfo>, flagged: boolean): void {
        // noop
    }

    public doOpen(repoDocInfo: RepoDocInfo): void {
        // noop
    }

    public doRename(repoDocInfo: RepoDocInfo, title: string): void {
        // noop
    }

    public doShowFile(repoDocInfo: RepoDocInfo): void {
        // noop
    }

    public doTagSelected(tags: ReadonlyArray<string>): void {
        // noop
    }

    // **** event handlers



    public onArchived(): void {
        // noop
    }

    public onCopyDocumentID(): void {
        // noop
    }

    public onCopyFilePath(): void {
        // noop
    }

    public onCopyOriginalURL(): void {
        // noop
    }

    public onFlagged(): void {
        // noop
    }

    public onOpen(): void {
        // noop
    }

    public onShowFile(): void {
        // noop
    }

    public onTagSelected(tags: ReadonlyArray<string>): void {
        // noop
    }

    public onDragStart(event: React.DragEvent) {

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

    public onDragEnd() {
        console.log("onDragEnd");
        DraggingSelectedDocs.clear();
    };

    public onDropped(tag: Tag) {
        const dragged = DraggingSelectedDocs.get();
        if (dragged) {
            this.doDropped(dragged, tag);
        }
    }

    public onRename() {

        const repoDocInfo = this.first()!;

        const dialogs = useDialogManager();

        dialogs.prompt({
            title: "Enter a new title for the document:",
            defaultValue: repoDocInfo.title,
            onCancel: NULL_FUNCTION,
            onDone: (value) => this.doRename(repoDocInfo, value)
        });

    };

    public onDeleted() {

        const dialogs = useDialogManager();

        const repoDocInfos = this.selectedProvider();

        if (repoDocInfos.length === 0) {
            // no work to do
            return;
        }

        dialogs.confirm({
            title: "Are you sure you want to delete these item(s)?",
            subtitle: "This is a permanent operation and can't be undone.  ",
            type: 'danger',
            onAccept: () => this.doDeleted(repoDocInfos),
        });

    }

    public onTagged() {

        const dialogs = useDialogManager();

        const repoDocInfos = this.selectedProvider();

        if (repoDocInfos.length === 0) {
            // no work to do
            return;
        }

        const {repoDocMetaManager, tagsProvider} = this;

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
            onDone: tags => this.doTagged(repoDocInfos, tags)
        };

        dialogs.autocomplete(autocompleteProps);

    }


}

const callbacksFactory = (store: ObservableStore<IDocRepoStore>,
                          setStore: (store: IDocRepoStore) => void): IDocRepoCallbacks => {


};

const [DocRepoStoreProvider, useMyInvitationStore, useMyInvitationStoreCallbacks]
    = createObservableStore<IDocRepoStore, IDocRepoCallbacks>(docRepoStore, callbacksFactory);

interface IProps {
    readonly children: JSX.Element;
}

export const DocRepoStore2 = React.memo((props: IProps) => {

    return (
        <DocRepoStoreProvider>
            {props.children}
        </DocRepoStoreProvider>
    )

});
