import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {RepoDocMetaLoader} from '../RepoDocMetaLoader';
import {RepoDocInfo} from '../RepoDocInfo';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Tag, Tags, TagStr} from 'polar-shared/src/tags/Tags';
import {isPresent} from 'polar-shared/src/Preconditions';
import {RendererAnalytics} from '../../../../web/js/ga/RendererAnalytics';
import {MessageBanner} from '../MessageBanner';
import {DocRepoTableDropdown} from './DocRepoTableDropdown';
import {DocRepoTableColumns, DocRepoTableColumnsMap} from './DocRepoTableColumns';
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
import {DocRepoTable} from './DocRepoTable';
import {Dock} from '../../../../web/js/ui/dock/Dock';
import {TagDescriptor} from '../../../../web/js/tags/TagNode';
import {Instance} from "react-table";
import {Arrays} from "polar-shared/src/util/Arrays";
import {Numbers} from "polar-shared/src/util/Numbers";
import {DraggingSelectedDocs} from "./SelectedDocs";
import {TreeState} from "../../../../web/js/ui/tree/TreeState";
import {SetArrays} from "polar-shared/src/util/SetArrays";
import {FolderSidebar} from "../folders/FolderSidebar";
import {IDMaps} from "polar-shared/src/util/IDMaps";
import {ListenablePersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";

const log = Logger.create();

// TODO: go back to ExtendedReactTable

export default class DocRepoScreen extends ReleasingReactComponent<IProps, IState> {

    private readonly treeState: TreeState<TagDescriptor>;

    private static hasSentInitAnalytics = false;

    private readonly synchronizingDocLoader: SynchronizingDocLoader;

    private reactTable?: Instance;

    private readonly docRepoFilters: DocRepoFilters;

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

        this.onRemoveFromFolder = this.onRemoveFromFolder.bind(this);

        this.state = {
            data: [],
            tags: [],
            columns: IDMaps.create(Object.values(new DocRepoTableColumns())),
            selected: [],
            docSidebarVisible: false
        };

        const onRefreshed: RefreshedCallback = repoDocInfos => this.doRefresh(repoDocInfos);

        const repoDocInfosProvider = () => this.props.repoDocMetaManager!.repoDocInfoIndex.values();

        this.docRepoFilters =
            new DocRepoFilters(onRefreshed, repoDocInfosProvider);

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

        RendererAnalytics.set({'nrDocs': nrDocs});

        const persistenceLayerType = this.props.persistenceLayerController.currentType();

        RendererAnalytics.event({category: 'document-repository', action: `docs-loaded-${persistenceLayerType}-${nrDocs}`});

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

    private onRemoveFromFolder(folder: Tag, repoDocInfos: ReadonlyArray<RepoDocInfo>) {

        for (const repoDocInfo of repoDocInfos) {
            const existingTags = Object.values(repoDocInfo.tags || {});
            const newTags = Tags.difference(existingTags, [folder]);

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
                     event: MouseEvent,
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

    public render() {

        const tagsProvider = () => this.props.repoDocMetaManager!.repoDocInfoIndex.toTagDescriptors();

        const docActive = {
            right: 'd-none-mobile',
            splitter: 'd-none-mobile'
        };

        const docInactive = {
            right: 'd-none',
            splitter: 'd-none'
        };


        const rightDocComponentClassNames = this.state.docSidebarVisible ? docActive : docInactive;

        return (
            <div id="doc-repository"
                 className=""
                 style={{
                     height: '100%'
                 }}>

                <FixedNav id="doc-repo-table">

                    <header>

                        <RepoHeader persistenceLayerProvider={this.props.persistenceLayerProvider}
                                    persistenceLayerController={this.props.persistenceLayerController}/>

                        <div id="header-filter" className="border-bottom">

                            <div style={{display: 'flex'}}
                                 className="p-1">

                                <div className=""
                                     style={{
                                         whiteSpace: 'nowrap',
                                         marginTop: 'auto',
                                         marginBottom: 'auto',
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
                                                      tagsDBProvider={() => this.props.repoDocMetaManager!.tagsDB}
                                                      refresher={() => this.refresh()}
                                                      filteredTags={this.docRepoFilters.filters.filteredTags}
                                                      docSidebarVisible={this.state.docSidebarVisible}
                                                      onDocSidebarVisible={visible => this.onDocSidebarVisible(visible)}
                                                      right={
                                                   <div className="d-mobile-none"
                                                        style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                                                       <DocRepoTableDropdown id="table-dropdown"
                                                                             options={Object.values(this.state.columns)}
                                                                             onSelectedColumns={(selectedColumns) => this.onSelectedColumns(selectedColumns)}/>
                                                   </div>
                                               }
                                    />

                                </div>

                            </div>

                        </div>

                        <MessageBanner/>

                    </header>

                    <Dock
                        componentClassNames={{
                            left: 'd-none-mobile',
                            splitter: 'd-none-mobile'
                        }}
                        side='left'
                        initialWidth={300}
                        left={
                            <FolderSidebar persistenceLayerProvider={this.props.persistenceLayerProvider}
                                           treeState={this.treeState}
                                           tags={this.state.tags}/>
                        }
                        right={
                            <Dock
                                componentClassNames={rightDocComponentClassNames}
                                side='right'
                                initialWidth={300}
                                left={

                                    <DocRepoTable columns={this.state.columns}
                                                  selected={this.state.selected}
                                                  data={this.state.data}
                                                  relatedTags={this.props.repoDocMetaManager!.relatedTags}
                                                  synchronizingDocLoader={this.synchronizingDocLoader}
                                                  tagsProvider={() => tagsProvider()}
                                                  writeDocInfoTags={(repoDocInfo, tags) => this.props.repoDocMetaManager!.writeDocInfoTags(repoDocInfo, tags)}
                                                  deleteDocInfo={repoDocInfo => this.props.repoDocMetaManager.deleteDocInfo(repoDocInfo)}
                                                  writeDocInfoTitle={(repoDocInfo, title) => this.props.repoDocMetaManager.writeDocInfoTitle(repoDocInfo, title)}
                                                  writeDocInfo={docInfo => this.props.repoDocMetaManager.writeDocInfo(docInfo)}
                                                  refresh={() => this.refresh()}
                                                  onDocDeleteRequested={repoDocInfos => this.onDocDeleteRequested(repoDocInfos)}
                                                  onDocDeleted={repoDocInfos => this.onDocDeleted(repoDocInfos)}
                                                  onDocSetTitle={(repoDocInfo, title) => this.onDocSetTitle(repoDocInfo, title)}
                                                  onDocTagged={(repoDocInfo, tags) => this.onDocTagged(repoDocInfo, tags)}
                                                  onMultiDeleted={() => this.onMultiDeleted()}
                                                  selectRow={(selectedIdx, event1, type) => this.selectRow(selectedIdx, event1, type)}
                                                  onSelected={selected => this.onSelected(selected)}
                                                  onReactTable={reactTable => this.reactTable = reactTable}
                                                  onDragStart={event => this.onDragStart(event)}
                                                  onDragEnd={() => this.onDragEnd()}
                                                  filters={this.docRepoFilters.filters}
                                                  getSelected={() => this.getSelected()}
                                                  getRow={(viewIndex) => this.getRow(viewIndex)}
                                                  onRemoveFromFolder={(folder, repoDocInfos) => this.onRemoveFromFolder(folder, repoDocInfos)}/>

                                }
                                right={
                                    <div>
                                        {/*<DocSidebar meta={primaryDoc ? primaryDoc.docInfo : undefined}*/}
                                        {/*            persistenceLayerProvider={() => this.props.persistenceLayerManager.get()}/>*/}
                                    </div>
                                }
                            />

                        }/>


                </FixedNav>
            </div>

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

        RendererAnalytics.event({category: 'user', action: 'doc-tagged'});

        await this.props.repoDocMetaManager!.writeDocInfoTags(repoDocInfo, tags);
        this.refresh();

    }

    private onDocDeleteRequested(repoDocInfos: ReadonlyArray<RepoDocInfo>) {

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

        RendererAnalytics.event({category: 'user', action: 'set-doc-title'});

        log.info("Setting doc title: " , title);

        this.props.repoDocMetaManager.writeDocInfoTitle(repoDocInfo, title)
            .catch(err => log.error("Could not write doc title: ", err));

        this.refresh();

    }

    private onSelectedColumns(columns: ReadonlyArray<ListOptionType>) {

        RendererAnalytics.event({category: 'user', action: 'selected-columns'});

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
        RendererAnalytics.event({category: 'user', action: 'filter-by-title'});
        this.docRepoFilters.onFilterByTitle(title);
    }

    private refresh() {
        this.docRepoFilters.refresh();
    }

    /**
     * Perform the actual refresh.
     */
    private doRefresh(data: ReadonlyArray<RepoDocInfo>) {

        const tags = this.props.repoDocMetaManager.repoDocInfoIndex.toTagDescriptors();

        const state = {...this.state, data, tags};

        setTimeout(() => {

            // The react table will not update when I change the state from
            // within the event listener
            this.setState(state);

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

    readonly userTags: ReadonlyArray<Tag> | undefined;

}

interface IState {
    readonly data: ReadonlyArray<RepoDocInfo>;
    readonly tags: ReadonlyArray<TagDescriptor>;
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
