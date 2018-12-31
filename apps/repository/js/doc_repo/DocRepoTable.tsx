import * as React from 'react';
import ReactTable from "react-table";
import {Footer, Tips} from '../Utils';
import {Logger} from '../../../../web/js/logger/Logger';
import {DocLoader} from '../../../../web/js/apps/main/ipc/DocLoader';
import {Strings} from '../../../../web/js/util/Strings';
import {RepoDocMetaLoader} from '../RepoDocMetaLoader';
import {AppState} from '../AppState';
import {RepoDocInfo} from '../RepoDocInfo';
import {RepoDocInfos} from '../RepoDocInfos';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {TagInput} from '../TagInput';
import {Optional} from '../../../../web/js/util/ts/Optional';
import {Tag} from '../../../../web/js/tags/Tag';
import {FilterTagInput} from '../FilterTagInput';
import {FilteredTags} from '../FilteredTags';
import {isPresent} from '../../../../web/js/Preconditions';
import {Sets} from '../../../../web/js/util/Sets';
import {Tags} from '../../../../web/js/tags/Tags';
import {DateTimeTableCell} from '../DateTimeTableCell';
import {RendererAnalytics} from '../../../../web/js/ga/RendererAnalytics';
import {MessageBanner} from '../MessageBanner';
import {DocDropdown} from '../DocDropdown';
import {DocRepoTableDropdown} from './DocRepoTableDropdown';
import {DocRepoTableColumns} from './DocRepoTableColumns';
import {SettingsStore} from '../../../../web/js/datastore/SettingsStore';
import {Version} from '../../../../web/js/util/Version';
import {RepoDocInfoIndex} from '../RepoDocInfoIndex';
import {AutoUpdatesController} from '../../../../web/js/auto_updates/AutoUpdatesController';
import {IDocInfo} from '../../../../web/js/metadata/DocInfo';
import {SyncBarProgress} from '../../../../web/js/ui/sync_bar/SyncBar';
import {IEventDispatcher, SimpleReactor} from '../../../../web/js/reactor/SimpleReactor';
import {DocRepoAnkiSyncController} from '../../../../web/js/controller/DocRepoAnkiSyncController';
import {CloudAuthButton} from '../../../../web/js/ui/cloud_auth/CloudAuthButton';
import {PersistenceLayerManager, PersistenceLayerTypes} from '../../../../web/js/datastore/PersistenceLayerManager';
import {PersistenceLayerEvent} from '../../../../web/js/datastore/PersistenceLayerEvent';
import {CloudService} from '../cloud/CloudService';
import {Throttler} from '../../../../web/js/datastore/Throttler';
import {PersistenceLayer} from '../../../../web/js/datastore/PersistenceLayer';
import {Backend} from '../../../../web/js/datastore/Backend';
import {Hashcode} from '../../../../web/js/metadata/Hashcode';
import {FileRef} from '../../../../web/js/datastore/Datastore';
import {ListenablePersistenceLayer} from '../../../../web/js/datastore/ListenablePersistenceLayer';
import {RepoSidebar} from '../RepoSidebar';
import {MultiReleaser} from '../../../../web/js/reactor/EventListener';
import {RepoDocMetaLoaders} from '../RepoDocMetaLoaders';
import {PersistenceLayerManagers} from '../../../../web/js/datastore/PersistenceLayerManagers';
import ReleasingReactComponent from '../framework/ReleasingReactComponent';
import {ExtendedReactTable, IReactTableState} from '../util/ExtendedReactTable';
import {SynchronizingDocLoader} from '../util/SynchronizingDocLoader';
import {ToggleButton} from '../../../../web/js/ui/ToggleButton';
import {Input} from 'reactstrap';

const log = Logger.create();

export default class DocRepoTable extends ExtendedReactTable<IProps, IState> {

    private static hasSentInitAnalyitics = false;

    private readonly persistenceLayerManager: PersistenceLayerManager;

    private readonly filteredTags = new FilteredTags();

    private readonly syncBarProgress: IEventDispatcher<SyncBarProgress> = new SimpleReactor();

    private readonly synchronizingDocLoader: SynchronizingDocLoader;

    private filterArchived = true;

    private filterFlaggedOnly = false;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.persistenceLayerManager = this.props.persistenceLayerManager;
        this.synchronizingDocLoader = new SynchronizingDocLoader(this.props.persistenceLayerManager);

        this.onDocTagged = this.onDocTagged.bind(this);
        this.onDocDeleted = this.onDocDeleted.bind(this);
        this.onDocSetTitle = this.onDocSetTitle.bind(this);
        this.onSelectedColumns = this.onSelectedColumns.bind(this);
        this.onFilterByTitle = this.onFilterByTitle.bind(this);

        this.onToggleFilterArchived = this.onToggleFilterArchived.bind(this);
        this.onToggleFlaggedOnly = this.onToggleFlaggedOnly.bind(this);

        this.state = {
            data: [],
            columns: new DocRepoTableColumns()
        };

        this.init();

        this.initAsync()
            .catch(err => log.error("Could not init: ", err));

    }

    private init() {

        // TODO: when we get a NEW persistence layer we probably need to release
        // the old event listener as the component is still mounted but the old
        // persistence layer has now gone away.

        PersistenceLayerManagers.onPersistenceManager(this.props.persistenceLayerManager, (persistenceLayer) => {

            this.releaser.register(
                persistenceLayer.addEventListener(() => this.refresh()));

        });

        this.releaser.register(
            RepoDocMetaLoaders.addThrottlingEventListener(this.props.repoDocMetaLoader, () => this.refresh()));

        this.releaser.register(
            this.props.repoDocMetaLoader.addEventListener(event => {

                if (!DocRepoTable.hasSentInitAnalyitics && event.progress.progress === 100) {
                    this.emitInitAnalytics(this.props.repoDocMetaManager.repoDocInfoIndex);
                    DocRepoTable.hasSentInitAnalyitics = true;
                }

            })
        );

    }

    private async initAsync(): Promise<void> {

        const settings = await SettingsStore.load();

        log.info("Settings loaded: ", settings);

        Optional.of(settings.documentRepository)
            .map(current => current.columns)
            .when(columns => {

                log.info("Loaded columns from settings: ", columns);
                this.setState(Object.assign(this.state, {columns}));
                this.refresh();

            });

        this.refresh();

    }

    private emitInitAnalytics(repoDocs: RepoDocInfoIndex) {

        RendererAnalytics.pageview("/");

        const nrDocs = Object.keys(repoDocs).length;

        RendererAnalytics.set({'nrDocs': nrDocs});

        const persistenceLayerType = this.persistenceLayerManager.currentType();

        RendererAnalytics.event({category: 'document-repository', action: `docs-loaded-${persistenceLayerType}-${nrDocs}`});

        RendererAnalytics.event({category: 'app', action: 'version-' + Version.get()});

    }

    public highlightRow(selected: number) {

        const state: AppState = Object.assign({}, this.state);
        state.selected = selected;

        this.setState(state);

    }

    public render() {
        const { data } = this.state;
        return (

            <div id="doc-repo-table">

                <header>

                    <RepoSidebar/>

                    <div id="header-filter">

                        <div className="header-filter-boxes">

                            <div className="header-filter-box"
                                 style={{whiteSpace: 'nowrap'}}>
                                <div className="checkbox-group">

                                    <ToggleButton label="flagged only"
                                                  initialValue={false}
                                                  onChange={value => this.onToggleFlaggedOnly(value)}/>

                                </div>
                            </div>

                            <div className="header-filter-box"
                                 style={{whiteSpace: 'nowrap'}}>

                                <div className="checkbox-group">

                                    <ToggleButton label="hide archived"
                                                  initialValue={true}
                                                  onChange={value => this.onToggleFilterArchived(value)}/>

                                </div>

                            </div>

                            <div className="header-filter-box header-filter-tags"
                                 style={{whiteSpace: 'nowrap'}}>

                                <FilterTagInput tagsDBProvider={() => this.props.repoDocMetaManager!.tagsDB}
                                                refresher={() => this.refresh()}
                                                filteredTags={this.filteredTags} />

                            </div>

                            <div className="header-filter-box">

                                <input id="filter_title"
                                       type="text"
                                       placeholder="Filter by title"
                                       onChange={() => this.onFilterByTitle()}/>
                            </div>

                            <div className="header-filter-box">
                                <CloudAuthButton persistenceLayerManager={this.persistenceLayerManager} />
                            </div>

                            <div className="p-1">

                                <DocRepoTableDropdown id="table-dropdown"
                                                      options={Object.values(this.state.columns)}
                                                      onSelectedColumns={() => this.onSelectedColumns()}/>
                            </div>

                        </div>


                    </div>


                </header>

                <MessageBanner/>

                <div id="doc-table">
                <ReactTable
                    data={data}
                    columns={
                        [
                            {
                                Header: 'Title',
                                accessor: 'title',
                                Cell: (row: any) => {
                                    const id = 'doc-repo-row-title' + row.index;
                                    return (
                                        <div id={id}>

                                            <div>{row.value}</div>

                                            {/*TODO: this doesn't reliably work as*/}
                                            {/*moving the mouse horizontally within*/}
                                            {/*the target doesn't close the tooltip.*/}

                                                {/*<UncontrolledTooltip style={{maxWidth: '1000px'}}*/}
                                                                     {/*placement="bottom"*/}
                                                                     {/*delay={{show: 750, hide: 0}}*/}
                                                                     {/*target={id}>*/}
                                                    {/*<Collapse timeout={{ enter: 0, exit: 0 }} >*/}
                                                        {/*{row.value}*/}
                                                    {/*</Collapse>*/}

                                                {/*</UncontrolledTooltip>*/}

                                        </div>

                                    );
                                }

                            },
                            {
                                Header: 'Updated',
                                // accessor: (row: any) => row.added,
                                accessor: 'lastUpdated',
                                show: this.state.columns.lastUpdated.selected,
                                maxWidth: 100,
                                defaultSortDesc: true,
                                Cell: (row: any) => (
                                    <DateTimeTableCell className="doc-col-last-updated" datetime={row.value}/>
                                )

                            },
                            {
                                Header: 'Added',
                                // accessor: (row: any) => row.added,
                                accessor: 'added',
                                show: this.state.columns.added.selected,
                                maxWidth: 100,
                                defaultSortDesc: true,
                                Cell: (row: any) => (
                                    <DateTimeTableCell className="doc-col-added" datetime={row.value}/>
                                )
                            },
                            //
                            // d => {
                            //     return Moment(d.updated_at)
                            //         .local()
                            //         .format("DD-MM-YYYY hh:mm:ss a")
                            // }

                            // {
                            //     Header: 'Last Name',
                            //     id: 'lastName',
                            //     accessor: (d: any) => d.lastName
                            // },
                            {
                                id: 'tags',
                                Header: 'Tags',
                                accessor: '',
                                show: this.state.columns.tags.selected,
                                Cell: (row: any) => {

                                    const tags: {[id: string]: Tag} = row.original.tags;

                                    const formatted = Object.values(tags)
                                        .map(tag => tag.label)
                                        .sort()
                                        .join(", ");

                                    return (
                                        <div>{formatted}</div>
                                    );

                                }
                            },
                            {
                                id: 'nrAnnotations',
                                Header: 'Annotations',
                                accessor: 'nrAnnotations',
                                maxWidth: 110,
                                show: this.state.columns.nrAnnotations.selected,
                                defaultSortDesc: true,
                                resizable: false,
                            },
                            {
                                id: 'progress',
                                Header: 'Progress',
                                accessor: 'progress',
                                show: this.state.columns.progress.selected,
                                maxWidth: 100,
                                defaultSortDesc: true,
                                resizable: false,
                                Cell: (row: any) => (

                                    <progress max="100" value={ row.value } style={{
                                        width: '100%'
                                    }} />
                                )
                            },
                            {
                                id: 'tag-input',
                                Header: '',
                                accessor: '',
                                maxWidth: 25,
                                defaultSortDesc: true,
                                resizable: false,
                                Cell: (row: any) => {

                                    const repoDocInfo: RepoDocInfo = row.original;

                                    const existingTags: Tag[]
                                        = Object.values(Optional.of(repoDocInfo.docInfo.tags).getOrElse({}));

                                    return (
                                        <TagInput repoDocInfo={repoDocInfo}
                                                  tagsDB={this.props.repoDocMetaManager!.tagsDB}
                                                  existingTags={existingTags}
                                                  onChange={(tags) =>
                                                      this.onDocTagged(repoDocInfo, tags)
                                                          .catch(err => log.error("Unable to update tags: ", err))} />
                                    );

                                }
                            },
                            {
                                id: 'flagged',
                                Header: '',
                                accessor: 'flagged',
                                show: this.state.columns.flagged.selected,
                                maxWidth: 25,
                                defaultSortDesc: true,
                                resizable: false,
                                Cell: (row: any) => {

                                    const title = 'Flag document';

                                    if (row.original.flagged) {
                                        return (
                                            <i className="fa fa-flag doc-button doc-button-active" title={title}/>
                                        );
                                    } else {
                                        return (
                                            <i className="fa fa-flag doc-button doc-button-inactive" title={title}/>
                                        );
                                    }

                                }
                            },
                            {
                                id: 'archived',
                                Header: '',
                                accessor: 'archived',
                                show: this.state.columns.archived.selected,
                                maxWidth: 25,
                                defaultSortDesc: true,
                                resizable: false,
                                Cell: (row: any) => {

                                    const title = 'Archive document';

                                    const uiClassName = row.original.archived ? 'doc-button-active' : 'doc-button-inactive';

                                    const className = `fa fa-check doc-button ${uiClassName}`;

                                    return (
                                        <i className={className} title={title}/>
                                    );

                                }
                            },
                            {
                                id: 'doc-dropdown',
                                Header: '',
                                accessor: '',
                                maxWidth: 25,
                                defaultSortDesc: true,
                                resizable: false,
                                sortable: false,
                                className: 'doc-dropdown',
                                Cell: (row: any) => {

                                    const repoDocInfo: RepoDocInfo = row.original;

                                    return (
                                        <DocDropdown id={'doc-dropdown-' + row.index}
                                                     repoDocInfo={repoDocInfo}
                                                     onDelete={this.onDocDeleted}
                                                     onSetTitle={this.onDocSetTitle}/>
                                    );

                                }
                            }




                        ]}

                    defaultPageSize={25}
                    noDataText="No documents available."
                    className="-striped -highlight"
                    defaultSorted={[
                        {
                            id: "progress",
                            desc: true
                        }
                    ]}
                    // sorted={[{
                    //     id: 'added',
                    //     desc: true
                    // }]}
                    getTrProps={(state: any, rowInfo: any) => {
                        return {

                            onClick: (e: any) => {
                                // console.log(`doc fingerprint:
                                // ${rowInfo.original.fingerprint} and filename
                                // ${rowInfo.original.filename}`);
                                this.highlightRow(rowInfo.viewIndex as number);
                            },

                            style: {
                                background: rowInfo && rowInfo.viewIndex === this.state.selected ? '#00afec' : 'white',
                                color: rowInfo && rowInfo.viewIndex === this.state.selected ? 'white' : 'black',
                            }
                        };
                    }}
                    getTdProps={(state: any, rowInfo: any, column: any, instance: any) => {

                        const singleClickColumns = ['tag-input', 'flagged', 'archived', 'doc-dropdown'];

                        if (! singleClickColumns.includes(column.id)) {
                            return {
                                onDoubleClick: (e: any) => {
                                    this.onDocumentLoadRequested(rowInfo.original.fingerprint,
                                                                 rowInfo.original.filename,
                                                                 rowInfo.original.hashcode);
                                }
                            };
                        }

                        if (singleClickColumns.includes(column.id)) {

                            return {

                                onClick: ((e: any, handleOriginal?: () => void) => {

                                    this.handleToggleField(rowInfo.original, column.id)
                                        .catch(err => log.error("Could not handle toggle: ", err));

                                    if (handleOriginal) {
                                        // needed for react table to function
                                        // properly.
                                        handleOriginal();
                                    }

                                })

                            };

                        }

                        return {};

                    }}

                />
                <br />
                <Tips />
                <Footer/>

                </div>

                {/*<CookieBanner*/}
                    {/*message="We use cookies to track user behavior using Google Analytics and other 3rd party services. "*/}
                    {/*buttonMessage="I Accept"*/}
                    {/*link={<a href='https://github.com/burtonator/polar-bookshelf/blob/master/docs/Tracking-Policy.md'>
                                More information</a>}*/}
                    {/*styles={{*/}
                        {/*banner: { backgroundColor: 'rgba(60, 60, 60, 0.8)', position: 'fixed', left: '0', bottom: '0' },*/}
                        {/*message: { fontWeight: 400 }*/}
                    {/*}}*/}
                    {/*dismissOnClick={true}*/}
                    {/*onAccept={() => console.log('accepted')}*/}
                    {/*cookie="user-has-accepted-cookies"*/}
                    {/*//*/}
                {/*/>*/}

            </div>

        );
    }

    private async onDocTagged(repoDocInfo: RepoDocInfo, tags: Tag[]) {

        RendererAnalytics.event({category: 'user', action: 'doc-tagged'});

        await this.props.repoDocMetaManager!.writeDocInfoTags(repoDocInfo, tags);
        this.refresh();

    }

    private onDocDeleted(repoDocInfo: RepoDocInfo) {

        RendererAnalytics.event({category: 'user', action: 'doc-deleted'});

        log.info("Deleting document: ", repoDocInfo);

        this.props.repoDocMetaManager.deleteDocInfo(repoDocInfo)
            .catch(err => log.error("Could not delete doc: ", err));

        this.refresh();

    }

    private onDocSetTitle(repoDocInfo: RepoDocInfo, title: string) {

        RendererAnalytics.event({category: 'user', action: 'set-doc-title'});

        log.info("Setting doc title: " , title);

        this.props.repoDocMetaManager.writeDocInfoTitle(repoDocInfo, title)
            .catch(err => log.error("Could not write doc title: ", err));

        this.refresh();

    }

    private onSelectedColumns() {

        RendererAnalytics.event({category: 'user', action: 'selected-columns'});

        // new columns have been selected. Note that the UI updates the values
        // directly so we can just write what's in memory to disk. I think it
        // would be better practice to keep them immutable.

        SettingsStore.load()
            .then((settings) => {
                settings.documentRepository.columns = this.state.columns;
                SettingsStore.write(settings);
            })
            .catch(err => log.error("Could not load settings: ", err));

        this.refresh();
    }


    private onFilterByTitle() {

        RendererAnalytics.event({category: 'user', action: 'filter-by-title'});

        this.refresh();

    }

    public refresh() {
        this.doRefresh(this.filter(Object.values(this.props.repoDocMetaManager!.repoDocInfoIndex)));
    }

    /**
     * Perform the actual refresh.
     */
    private doRefresh(data: RepoDocInfo[]) {

        const state = {...this.state, data};

        setTimeout(() => {

            // The react table will not update when I change the state from
            // within the event listener
            this.setState(state);

        }, 1);

    }

    private filter(repoDocInfos: RepoDocInfo[]): RepoDocInfo[] {

        // always filter valid to make sure nothing corrupts the state.  Some
        // other bug might inject a problem otherwise.
        repoDocInfos = this.doFilterValid(repoDocInfos);
        repoDocInfos = this.doFilterByTitle(repoDocInfos);
        repoDocInfos = this.doFilterFlaggedOnly(repoDocInfos);
        repoDocInfos = this.doFilterHideArchived(repoDocInfos);
        repoDocInfos = this.doFilterByTags(repoDocInfos);

        return repoDocInfos;

    }

    private doFilterValid(repoDocs: RepoDocInfo[]): RepoDocInfo[] {
        return repoDocs.filter(current => RepoDocInfos.isValid(current));
    }

    private doFilterByTitle(repoDocs: RepoDocInfo[]): RepoDocInfo[] {

        const filterElement = document.querySelector("#filter_title") as HTMLInputElement;

        const filterText = filterElement.value;

        if (! Strings.empty(filterText)) {

            return repoDocs.filter(current => current.title &&
                current.title.toLowerCase().indexOf(filterText!.toLowerCase()) >= 0 );

        }

        return repoDocs;

    }

    private doFilterFlaggedOnly(repoDocs: RepoDocInfo[]): RepoDocInfo[] {

        if (this.filterFlaggedOnly) {
            return repoDocs.filter(current => current.flagged);
        }

        return repoDocs;

    }

    private doFilterHideArchived(repoDocs: RepoDocInfo[]): RepoDocInfo[] {

        if (this.filterArchived) {
            log.info("Applying archived filter");
            return repoDocs.filter(current => !current.archived);
        }

        return repoDocs;

    }

    private doFilterByTags(repoDocs: RepoDocInfo[]): RepoDocInfo[] {

        RendererAnalytics.event({category: 'user', action: 'filter-by-tags'});

        const tags = Tags.toIDs(this.filteredTags.get());

        return repoDocs.filter(current => {

            if (tags.length === 0) {
                // there is no filter in place...
                return true;
            }

            if (! isPresent(current.docInfo.tags)) {
                // the document we're searching over has not tags.
                return false;
            }

            const intersection =
                Sets.intersection(tags, Tags.toIDs(Object.values(current.docInfo.tags!)));

            return intersection.length === tags.length;


        });

    }

    private onDocumentLoadRequested(fingerprint: string,
                                    filename: string,
                                    hashcode?: Hashcode) {

        this.synchronizingDocLoader.load(fingerprint, filename, hashcode)
            .catch(err => log.error("Unable to load doc: ", err));

    }

    private async handleToggleField(repoDocInfo: RepoDocInfo, field: string) {

        // TODO: move to syncDocInfoArchived in DocRepository

        let mutated: boolean = false;

        if (field === 'archived') {
            RendererAnalytics.event({category: 'user', action: 'archived-doc'});
            repoDocInfo.archived = !repoDocInfo.archived;
            repoDocInfo.docInfo.archived = repoDocInfo.archived;
            mutated = true;
        }

        if (field === 'flagged') {

            RendererAnalytics.event({category: 'user', action: 'flagged-doc'});
            repoDocInfo.flagged = !repoDocInfo.flagged;
            repoDocInfo.docInfo.flagged = repoDocInfo.flagged;

            mutated = true;
        }

        if (mutated) {
            await this.props.repoDocMetaManager!.writeDocInfo(repoDocInfo.docInfo);
            this.refresh();
        }

    }

    private onToggleFlaggedOnly(value: boolean) {
        this.filterFlaggedOnly = value;
        this.refresh();
    }

    private onToggleFilterArchived(value: boolean) {
        this.filterArchived = value;
        this.refresh();
    }

}

interface IProps {

    readonly persistenceLayerManager: PersistenceLayerManager;

    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;

    readonly repoDocMetaManager: RepoDocMetaManager;

    readonly repoDocMetaLoader: RepoDocMetaLoader;
}

interface IState extends IReactTableState {
    data: RepoDocInfo[];
    columns: DocRepoTableColumns;
}

