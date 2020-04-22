import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {RepoDocMetaLoader} from '../RepoDocMetaLoader';
import {RepoDocInfo} from '../RepoDocInfo';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Tag, Tags, TagStr} from 'polar-shared/src/tags/Tags';
import {isPresent, Preconditions} from 'polar-shared/src/Preconditions';
import {MessageBanner} from '../MessageBanner';
import {DocRepoTableDropdown} from './DocRepoTableDropdown';
import {
    DocRepoTableColumns,
    DocRepoTableColumnsMap
} from './DocRepoTableColumns';
import {SettingsStore} from '../../../../web/js/datastore/SettingsStore';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {IEventDispatcher} from '../../../../web/js/reactor/SimpleReactor';
import {PersistenceLayerController} from '../../../../web/js/datastore/PersistenceLayerManager';
import {RepoDocMetaLoaders} from '../RepoDocMetaLoaders';
import {SynchronizingDocLoader} from '../util/SynchronizingDocLoader';
import ReleasingReactComponent from '../framework/ReleasingReactComponent';
import {RepoHeader} from '../repo_header/RepoHeader';
import {FixedNav} from '../FixedNav';
import {ListOptionType} from '../../../../web/js/ui/list_selector/ListSelector';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {DocRepoFilterBar} from './DocRepoFilterBar';
import {DocRepoFilters, RefreshedCallback} from './DocRepoFilters';
import {Settings} from '../../../../web/js/datastore/Settings';
import {Toaster} from '../../../../web/js/ui/toaster/Toaster';
import {ProgressTracker} from 'polar-shared/src/util/ProgressTracker';
import {ProgressMessages} from '../../../../web/js/ui/progress_bar/ProgressMessages';
import {Dialogs} from '../../../../web/js/ui/dialogs/Dialogs';
import {DocRepoButtonBar} from './DocRepoButtonBar';
import {DocRepoTableProps} from './DocRepoTable';
import {Instance} from "react-table";
import {Arrays} from "polar-shared/src/util/Arrays";
import {Numbers} from "polar-shared/src/util/Numbers";
import {DraggingSelectedDocs} from "./SelectedDocs";
import {TreeState} from "../../../../web/js/ui/tree/TreeState";
import {SetArrays} from "polar-shared/src/util/SetArrays";
import {FolderSidebar, FoldersSidebarProps} from "../folders/FolderSidebar";
import {IDMaps} from "polar-shared/src/util/IDMaps";
import {ListenablePersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {PersistenceLayerMutator} from "../persistence_layer/PersistenceLayerMutator";
import {DocRepoRenderProps} from "../persistence_layer/PersistenceLayerApp";
import {RepositoryTour} from "../../../../web/js/apps/repository/RepositoryTour";
import {DockLayout} from "../../../../web/js/ui/doc_layout/DockLayout";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {RepoFooter} from "../repo_footer/RepoFooter";
import {AddContent} from '../ui/AddContentButton';
import {Route, Switch} from "react-router";
import {ReactRouters} from "../../../../web/js/react/router/ReactRouters";
import {Link} from "react-router-dom";
import {Button} from "reactstrap";
import {LeftSidebar} from "../../../../web/js/ui/motion/LeftSidebar";
import {Analytics} from "../../../../web/js/analytics/Analytics";
import DocumentRepositoryTable
    from "../../../../web/spectron0/material-ui/doc_repo_table/DocumentRepositoryTable";
import {MUIPaperToolbar} from "../../../../web/spectron0/material-ui/MUIPaperToolbar";

const log = Logger.create();

// TODO: go back to ExtendedReactTable

namespace main {

    export interface DocumentsProps extends DocRepoTableProps {
        readonly data: ReadonlyArray<RepoDocInfo>;
        readonly columns: DocRepoTableColumnsMap;
        readonly selected: ReadonlyArray<number>;
    }

    export const Documents = (props: DocumentsProps) => (

        <DocumentRepositoryTable data={props.data}
                                 selected={props.selected}
                                 selectRow={props.selectRow}
                                 selectRows={props.onSelected}
                                 tagsProvider={props.tagsProvider}
                                 relatedTagsManager={props.relatedTagsManager}
                                 onOpen={() => console.log('onOpen')}
                                 onShowFile={() => console.log('onShowFile')}
                                 onRename={() => console.log('onRename')}
                                 onCopyOriginalURL={() => console.log('onCopyOriginalURL')}
                                 onCopyFilePath={() => console.log('onCopyFilePath')}
                                 onDeleted={() => console.log('onDelete')}
                                 onCopyDocumentID={() => console.log('onCopyDocumentID')}
                                 onTagged={NULL_FUNCTION}
                                 onFlagged={() => console.log('onFlagged')}
                                 onArchived={() => console.log('onArchived')}
        />

        // <DocRepoTable {...props}/>

    );

    export interface FoldersProps extends FoldersSidebarProps {

    }

    export const Folders = (props: FoldersSidebarProps) => (
        <FolderSidebar {...props}/>
    );

}

const onClose = () => window.history.back();

const Router = (props: main.FoldersProps) => (

    <Switch location={ReactRouters.createLocationWithHashOnly()}>

        <Route path='#folders'
               render={() => (
                   <LeftSidebar onClose={onClose}>
                       <main.Folders {...props}/>
                   </LeftSidebar>
               )}/>

    </Switch>

);

namespace devices {

    export interface DeviceProps extends main.DocumentsProps, main.FoldersProps {

    }

    export const PhoneAndTablet = (props: DeviceProps) => (
        <main.Documents {...props}/>
    );

    export const Desktop = (props: DeviceProps) => (

        <DockLayout dockPanels={[
            {
                id: "dock-panel-left",
                type: 'fixed',
                component: <FolderSidebar {...props}/>,
                width: 300,
                style: {
                    overflow: 'none'
                }
            },
            {
                id: "doc-panel-center",
                type: 'grow',
                component: <main.Documents {...props}/>
            }
        ]}/>

    );

}

export default class DocRepoScreen extends ReleasingReactComponent<IProps, IState> {

    private readonly treeState: TreeState<TagDescriptor>;

    private static hasSentInitAnalytics = false;

    private readonly synchronizingDocLoader: SynchronizingDocLoader;

    private reactTable?: Instance;

    private readonly docRepoFilters: DocRepoFilters;

    private readonly tagsProvider: () => ReadonlyArray<Tag>;
    private persistenceLayerMutator: PersistenceLayerMutator;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.synchronizingDocLoader = new SynchronizingDocLoader(this.props.persistenceLayerProvider);

        this.onDocDeleteRequested = this.onDocDeleteRequested.bind(this);

        this.onDocTagged = this.onDocTagged.bind(this);
        this.onDocDeleted = this.onDocDeleted.bind(this);
        this.onDocSetTitle = this.onDocSetTitle.bind(this);
        this.onSelectedColumns = this.onSelectedColumns.bind(this);
        this.onDocSidebarVisible = this.onDocSidebarVisible.bind(this);


        this.onFilterByTitle = this.onFilterByTitle.bind(this);
        this.onToggleFilterArchived = this.onToggleFilterArchived.bind(this);
        this.onToggleFlaggedOnly = this.onToggleFlaggedOnly.bind(this);

        this.clearSelected = this.clearSelected.bind(this);
        this.onSelected = this.onSelected.bind(this);
        this.selectRow = this.selectRow.bind(this);

        this.onMultiTagged = this.onMultiTagged.bind(this);
        this.onMultiDeleted = this.onMultiDeleted.bind(this);

        this.getSelected = this.getSelected.bind(this);
        this.getRow = this.getRow.bind(this);

        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);

        this.onRemoveFromTag = this.onRemoveFromTag.bind(this);

        this.createDeviceProps = this.createDeviceProps.bind(this);

        this.state = {
            data: [],
            columns: IDMaps.create(Object.values(new DocRepoTableColumns())),
            selected: [],
            docSidebarVisible: false
        };

        const onRefreshed: RefreshedCallback = repoDocInfos => this.doRefresh(repoDocInfos);

        const repoDocInfosProvider = () => this.props.repoDocMetaManager.repoDocInfoIndex.values();
        this.tagsProvider = this.props.tags;

        this.persistenceLayerMutator
            = new PersistenceLayerMutator(this.props.repoDocMetaManager,
                                          this.props.persistenceLayerProvider,
                                          this.tagsProvider,
                                          repoDocInfosProvider,
                                          () => this.refresh());

        this.docRepoFilters = new DocRepoFilters(onRefreshed, repoDocInfosProvider);

        const onSelected = (tags: ReadonlyArray<TagStr>) => this.docRepoFilters.onTagged(tags.map(current => Tags.create(current)));
        const onDropped = (tag: TagDescriptor) => this.onMultiTagged([tag], DraggingSelectedDocs.get());

        this.treeState = new TreeState(onSelected, onDropped);

        this.init();

        this.initAsync()
            .catch(err => log.error("Could not init: ", err));

    }

    private init() {

        // TODO: when we get a NEW persistence layer we probably need to release
        // the old event listener as the component is still mounted but the old
        // persistence layer has now gone away.

        const persistenceLayer = this.props.persistenceLayerProvider();

        this.releaser.register(persistenceLayer.addEventListener(() => this.refresh()));

        this.releaser.register(
            RepoDocMetaLoaders.addThrottlingEventListener(this.props.repoDocMetaLoader, () => this.refresh()));

        this.releaser.register(
            this.props.repoDocMetaLoader.addEventListener(event => {

                if (!DocRepoScreen.hasSentInitAnalytics && event.progress.progress === 100) {
                    this.emitInitAnalytics(this.props.repoDocMetaManager.repoDocInfoIndex.size());
                    DocRepoScreen.hasSentInitAnalytics = true;
                }

            })
        );

    }

    private async initAsync(): Promise<void> {

        const settingProvider = await SettingsStore.load();

        log.info("Settings loaded: ", settingProvider);

        Optional.of(settingProvider().documentRepository)
            .map(current => current.columns)
            .when(columns => {
                log.info("Loaded columns from settings: ", columns);
                this.setState({...this.state, columns});
                this.refresh();
            });

        this.refresh();

    }

    private emitInitAnalytics(nrDocs: number) {

        // TODO: move some of these analytics into the main RepoaitoryApp.tsx.

        Analytics.traits({'nrDocs': nrDocs});

        const persistenceLayerType = this.props.persistenceLayerController.currentType();

        // Analytics.event({category: 'document-repository', action: `docs-loaded-${persistenceLayerType}-${nrDocs}`});

    }

    private onMultiTagged(tags: ReadonlyArray<Tag>,
                          repoDocInfos: ReadonlyArray<RepoDocInfo> = this.getSelected()) {

        for (const repoDocInfo of repoDocInfos) {
            const existingTags = Object.values(repoDocInfo.tags || {});
            const effectiveTags = Tags.union(existingTags, tags || []);

            this.onDocTagged(repoDocInfo, effectiveTags)
                .catch(err => log.error(err));

        }

    }

    private onRemoveFromTag(rawTag: Tag, repoDocInfos: ReadonlyArray<RepoDocInfo>) {

        for (const repoDocInfo of repoDocInfos) {
            const existingTags = Object.values(repoDocInfo.tags || {});
            const newTags = Tags.difference(existingTags, [rawTag]);

            // TODO: this does N at once but we should really be using a queue for
            // this operation.
            this.onDocTagged(repoDocInfo, newTags)
                .catch(err => log.error(err));

        }

    }

    private onMultiDeleted() {
        const repoDocInfos = this.getSelected();
        this.onDocDeleteRequested(repoDocInfos);
    }

    private clearSelected() {

        setTimeout(() => {
            this.setState({...this.state, selected: []});
        }, 1);

    }

    private getSelected(): ReadonlyArray<RepoDocInfo> {

        if (! this.reactTable) {
            return [];
        }

        const resolvedState: IResolvedState = this.reactTable!.getResolvedState();

        const {sortedData} = resolvedState;

        const offset = (resolvedState.page) * resolvedState.pageSize;

        const result: RepoDocInfo[] =
            this.state.selected
                .map(selectedIdx => sortedData[offset + selectedIdx])
                .filter(item => isPresent(item))
                .map(item => item._original);

        return result;

    }

    private getRow(viewIndex: number): RepoDocInfo {
        const resolvedState: IResolvedState = this.reactTable!.getResolvedState();
        const {sortedData} = resolvedState;
        const offset = (resolvedState.page) * resolvedState.pageSize;
        const idx = offset + viewIndex;
        return sortedData[idx]._original;
    }

    public selectRow(selectedIdx: number,
                     event: React.MouseEvent,
                     type: SelectRowType) {

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

                if (this.state.selected.includes(selectedIdx)) {
                    return 'none';
                }

            }

            return 'one';

        };

        const doStrategyRange = (): SelectedRows => {

            // select a range

            let min: number = 0;
            let max: number = 0;

            if (this.state.selected.length > 0) {
                const sorted = [...this.state.selected].sort((a, b) => a - b);
                min = Arrays.first(sorted)!;
                max = Arrays.last(sorted)!;
            }

            const selected = [...Numbers.range(Math.min(min, selectedIdx),
                    Math.max(max, selectedIdx))];

            return selected;

        };

        const doStrategyToggle = (): SelectedRows => {
            const selected = [...this.state.selected];

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

        const selected = doStrategy();

        if (selected) {
            this.setState({...this.state, selected});
        }

    }

    public onSelected(selected: ReadonlyArray<number>) {
        this.setState({ ...this.state, selected });
    }

    private createDeviceProps(): devices.DeviceProps {

        return {
            ...this.state,
            relatedTagsManager: this.props.repoDocMetaManager!.relatedTags,
            synchronizingDocLoader: this.synchronizingDocLoader,
            tagsProvider: this.props.tags,
            writeDocInfoTags: (repoDocInfo, tags) => this.props.repoDocMetaManager!.writeDocInfoTags(repoDocInfo, tags),
            deleteDocInfo: repoDocInfo => this.props.repoDocMetaManager.deleteDocInfo(repoDocInfo),
            writeDocInfoTitle: (repoDocInfo, title) => this.props.repoDocMetaManager.writeDocInfoTitle(repoDocInfo, title),
            writeDocInfo: docInfo => this.props.repoDocMetaManager.writeDocInfo(docInfo),
            refresh: () => this.refresh(),
            onDocDeleteRequested: repoDocInfos => this.onDocDeleteRequested(repoDocInfos),
            onDocDeleted: repoDocInfos => this.onDocDeleted(repoDocInfos),
            onDocSetTitle: (repoDocInfo, title) => this.onDocSetTitle(repoDocInfo, title),
            onDocTagged: (repoDocInfo, tags) => this.onDocTagged(repoDocInfo, tags),
            onMultiDeleted: () => this.onMultiDeleted(),
            selectRow: this.selectRow,
            onSelected: selected => this.onSelected(selected),
            onReactTable: reactTable => this.reactTable = reactTable,
            onDragStart: event => this.onDragStart(event),
            onDragEnd: () => this.onDragEnd(),
            filters: this.docRepoFilters.filters,
            getSelected: () => this.getSelected(),
            getRow: (viewIndex) => this.getRow(viewIndex),
            onRemoveFromFolder: (folder, repoDocInfos) => this.onRemoveFromTag(folder, repoDocInfos),
            persistenceLayerMutator: this.persistenceLayerMutator,
            treeState: this.treeState,
            tags: this.props.tags()
        };

    }

    public render() {

        const tagsProvider = this.props.tags;

        const deviceProps = this.createDeviceProps();

        return (
            <FixedNav id="doc-repository">

                <RepositoryTour/>
                <header>

                    <RepoHeader toggle={(
                                    <Link to="#folders">
                                        <Button color="clear">
                                            <i className="fas fa-bars"/>
                                        </Button>
                                    </Link>
                                )}
                                persistenceLayerProvider={this.props.persistenceLayerProvider}
                                persistenceLayerController={this.props.persistenceLayerController}/>

                    <MUIPaperToolbar id="header-filter"
                                     borderBottom
                                     padding={1}>

                        <div style={{
                                 display: 'flex',
                                 alignItems: 'center'
                             }}>

                            <div className=""
                                 style={{
                                     whiteSpace: 'nowrap',
                                     display: 'flex'
                                 }}>

                                <DocRepoButtonBar hasSelected={this.state.selected.length > 0}
                                                  tagsProvider={tagsProvider}
                                                  onMultiTagged={tags => this.onMultiTagged(tags)}
                                                  onMultiDeleted={() => this.onMultiDeleted()}/>

                            </div>

                            <div style={{marginLeft: 'auto'}}>

                                <DocRepoFilterBar onToggleFlaggedOnly={value => this.onToggleFlaggedOnly(value)}
                                                  onToggleFilterArchived={value => this.onToggleFilterArchived(value)}
                                                  onFilterByTitle={(title) => this.onFilterByTitle(title)}
                                                  refresher={() => this.refresh()}
                                                  filteredTags={this.docRepoFilters.filters.filteredTags}
                                                  docSidebarVisible={this.state.docSidebarVisible}
                                                  onDocSidebarVisible={visible => this.onDocSidebarVisible(visible)}
                                                  right={
                                               <div className="d-none-phone d-none-tablet"
                                                    style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                                                   <DocRepoTableDropdown id="table-dropdown"
                                                                         options={Object.values(this.state.columns)}
                                                                         onSelectedColumns={(selectedColumns) => this.onSelectedColumns(selectedColumns)}/>
                                               </div>
                                           }
                                />

                            </div>

                        </div>
                    </MUIPaperToolbar>

                    <MessageBanner/>

                </header>

                <Router {...deviceProps}/>

                <DeviceRouter phone={<devices.PhoneAndTablet {...deviceProps}/>}
                              tablet={<devices.PhoneAndTablet {...deviceProps}/>}
                              desktop={<devices.Desktop {...deviceProps}/>}/>

                <FixedNav.Footer>

                    <DeviceRouter.Handheld>
                        <AddContent.Handheld/>
                    </DeviceRouter.Handheld>

                    <RepoFooter/>
                </FixedNav.Footer>

            </FixedNav>

        );
    }

    private onDragStart(event: DragEvent) {

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

        const selected = this.getSelected();
        DraggingSelectedDocs.set(selected);

    }

    private onDragEnd() {
        DraggingSelectedDocs.clear();
    }

    private async onDocTagged(repoDocInfo: RepoDocInfo, tags: ReadonlyArray<Tag>) {

        // Analytics.event({category: 'user', action: 'doc-tagged'});

        await this.props.repoDocMetaManager!.writeDocInfoTags(repoDocInfo, tags);
        this.refresh();

    }

    private onDocDeleteRequested(repoDocInfos: ReadonlyArray<RepoDocInfo>) {

        // FIXME: this is now obsolte

        Dialogs.confirm({
            title: "Are you sure you want to delete these document(s)?",
            subtitle: "This is a permanent operation and can't be undone.  All associated annotations will also be removed.",
            onCancel: NULL_FUNCTION,
            type: 'danger',
            onConfirm: () => this.onDocDeleted(repoDocInfos),
        });

    }

    private onDocSidebarVisible(docSidebarVisible: boolean) {
        this.setState({...this.state, docSidebarVisible});
    }

    private onDocDeleted(repoDocInfos: ReadonlyArray<RepoDocInfo>) {

        const doDeletes = async () => {

            const stats = {
                successes: 0,
                failures: 0
            };

            this.clearSelected();

            const progressTracker = new ProgressTracker({total: repoDocInfos.length, id: 'delete'});

            for (const repoDocInfo of repoDocInfos) {

                log.info("Deleting document: ", repoDocInfo);

                try {

                    await this.props.repoDocMetaManager.deleteDocInfo(repoDocInfo);
                    ++stats.successes;
                    this.refresh();

                } catch (e) {
                    ++stats.failures;
                    log.error("Could not delete doc: " , e);
                } finally {
                    const progress = progressTracker.incr();
                    ProgressMessages.broadcast(progress);
                }

            }

            this.clearSelected();

            if (stats.failures === 0) {
                Toaster.success(`${stats.successes} documents successfully deleted.`);
            } else {
                Toaster.error(`Failed to delete ${stats.failures} with ${stats.successes} successful.`);
            }

        };

        doDeletes()
            .catch(err => log.error("Unable to delete files: ", err));

    }

    private onDocSetTitle(repoDocInfo: RepoDocInfo, title: string) {

        // Analytics.event({category: 'user', action: 'set-doc-title'});

        log.info("Setting doc title: " , title);

        this.props.repoDocMetaManager.writeDocInfoTitle(repoDocInfo, title)
            .catch(err => log.error("Could not write doc title: ", err));

        this.refresh();

    }

    private onSelectedColumns(columns: ReadonlyArray<ListOptionType>) {

        // Analytics.event({category: 'user', action: 'selected-columns'});

        // tslint:disable-next-line:variable-name
        const columns_map = IDMaps.create(columns);

        setTimeout(() => {
            this.setState({...this.state, columns: columns_map});
        }, 1);

        SettingsStore.load()
            .then((settingsProvider) => {

                const currentSettings = settingsProvider();

                const settings: Settings = {
                    ...currentSettings,
                    documentRepository: {
                        columns: columns_map
                    }
                };

                SettingsStore.write(settings)
                    .catch(err => log.error(err));

            })
            .catch(err => log.error("Could not load settings: ", err));

        this.refresh();
    }


    private onFilterByTitle(title: string) {
        Preconditions.assertString(title, 'title');
        // Analytics.event({category: 'user', action: 'filter-by-title'});
        this.docRepoFilters.onFilterByTitle(title);
    }

    private refresh() {
        // this applies the filters and then calls doRefresh...
        this.docRepoFilters.refresh();
    }

    /**
     * Perform the actual refresh.
     */
    private doRefresh(data: ReadonlyArray<RepoDocInfo>) {

        setTimeout(() => {

            // The react table will not update when I change the state from
            // within the event listener
            this.setState({
                ...this.state,
                data,
            });

        }, 1);

    }

    private onToggleFlaggedOnly(value: boolean) {
        this.docRepoFilters.onToggleFlaggedOnly(value);
    }

    private onToggleFilterArchived(value: boolean) {
        this.docRepoFilters.onToggleFilterArchived(value);
    }

}

interface IProps {

    readonly persistenceLayerProvider: ListenablePersistenceLayerProvider;

    readonly persistenceLayerController: PersistenceLayerController;

    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;

    readonly repoDocMetaManager: RepoDocMetaManager;

    readonly repoDocMetaLoader: RepoDocMetaLoader;

    readonly tags: () => ReadonlyArray<TagDescriptor>;

    readonly docRepo: DocRepoRenderProps;

}

interface IState {
    readonly data: ReadonlyArray<RepoDocInfo>;
    readonly columns: DocRepoTableColumnsMap;
    readonly selected: ReadonlyArray<number>;
    readonly docSidebarVisible: boolean;
}

/**
 * The type of event that triggered the row selection.  Either a normal click, a context menu click (right click) or
 * a checkbox for selecting multiple.
 */
export type SelectRowType = 'click' | 'context' | 'checkbox';


interface TableItem {
    readonly _original: RepoDocInfo;
}

interface IResolvedState {
    readonly sortedData: ReadonlyArray<TableItem>;
    readonly page: number;
    readonly pageSize: number;
}
