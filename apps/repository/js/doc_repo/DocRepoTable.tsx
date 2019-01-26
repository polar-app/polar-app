import * as React from 'react';
import ReactTable from "react-table";
import {Footer, Tips} from '../Utils';
import {Logger} from '../../../../web/js/logger/Logger';
import {Strings} from '../../../../web/js/util/Strings';
import {RepoDocMetaLoader} from '../RepoDocMetaLoader';
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
import {IDocInfo} from '../../../../web/js/metadata/DocInfo';
import {SyncBarProgress} from '../../../../web/js/ui/sync_bar/SyncBar';
import {IEventDispatcher, SimpleReactor} from '../../../../web/js/reactor/SimpleReactor';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {Hashcode} from '../../../../web/js/metadata/Hashcode';
import {RepoDocMetaLoaders} from '../RepoDocMetaLoaders';
import {PersistenceLayerManagers} from '../../../../web/js/datastore/PersistenceLayerManagers';
import {SynchronizingDocLoader} from '../util/SynchronizingDocLoader';
import {ToggleButton} from '../../../../web/js/ui/ToggleButton';
import {DropdownItem, DropdownMenu, DropdownToggle, Input, InputGroup, UncontrolledDropdown} from 'reactstrap';
import ReleasingReactComponent from '../framework/ReleasingReactComponent';
import {Arrays} from '../../../../web/js/util/Arrays';
import {Numbers} from '../../../../web/js/util/Numbers';
import {SimpleTooltip} from '../../../../web/js/ui/tooltip/SimpleTooltip';
import {TagButton} from './TagButton';
import {RepoHeader} from '../RepoHeader';
import {remote} from 'electron';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {AddContentButton} from './AddContentButton';

const log = Logger.create();

// TODO: go back to ExtendedReactTable

export default class DocRepoTable extends ReleasingReactComponent<IProps, IState> {

    private static hasSentInitAnalyitics = false;

    private readonly persistenceLayerManager: PersistenceLayerManager;

    private readonly filteredTags = new FilteredTags();

    private readonly syncBarProgress: IEventDispatcher<SyncBarProgress> = new SimpleReactor();

    private readonly synchronizingDocLoader: SynchronizingDocLoader;

    private filterArchived = true;

    private filterFlaggedOnly = false;

    private reactTable: any;

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

        this.onMultiTagged = this.onMultiTagged.bind(this);
        this.getSelected = this.getSelected.bind(this);

        this.cmdImportFromDisk = this.cmdImportFromDisk.bind(this);
        this.cmdCaptureWebPage = this.cmdCaptureWebPage.bind(this);

        this.state = {
            data: [],
            columns: new DocRepoTableColumns(),
            selected: []
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

    public selectRow(selectedIdx: number, event: MouseEvent) {

        if (typeof selectedIdx === 'string') {
            selectedIdx = parseInt(selectedIdx);
        }

        let selected: number[] = [selectedIdx];

        if (event.getModifierState("Shift")) {

            // select a range

            let min: number = 0;
            let max: number = 0;

            if (this.state.selected.length > 0) {
                const sorted = [...this.state.selected].sort((a, b) => a - b);
                min = Arrays.first(sorted)!;
                max = Arrays.last(sorted)!;
            }

            selected = [...Numbers.range(Math.min(min, selectedIdx),
                                         Math.max(max, selectedIdx))];

        }

        if (event.getModifierState("Control") || event.getModifierState("Meta")) {

            // one at a time

            selected = [...this.state.selected];

            if (selected.includes(selectedIdx)) {
                selected.splice(selected.indexOf(selectedIdx), 1);
            } else {
                selected = [...selected, selectedIdx];
            }

        }

        this.setState({...this.state, selected});

    }

    private onMultiTagged(tags: Tag[]) {

        const repoDocInfos = this.getSelected();

        for (const repoDocInfo of repoDocInfos) {
            const existingTags = Object.values(repoDocInfo.tags || {});
            const effectTags = Tags.union(existingTags, tags || []);

            this.onDocTagged(repoDocInfo, effectTags)
                .catch(err => log.error(err));

        }

    }

    private getSelected(): RepoDocInfo[] {

        const resolvedState = this.reactTable!.getResolvedState();

        const sortedData = resolvedState.sortedData;

        const result: RepoDocInfo[] =
            this.state.selected
                .map(selectedIdx => sortedData[selectedIdx])
                .map(item => item._original);

        return result;

    }

    public render() {
        const { data } = this.state;
        return (

            <FixedNav id="doc-repo-table">

                <header>

                    <RepoHeader persistenceLayerManager={this.props.persistenceLayerManager}/>

                    <div id="header-filter">

                        <div style={{display: 'flex'}}>

                            <div className=""
                                 style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto', display: 'flex'}}>

                                <div className="mr-1"
                                     style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                                    <AddContentButton importFromDisk={() => this.cmdImportFromDisk()}
                                                      captureWebPage={this.cmdCaptureWebPage}/>

                                </div>


                                <div className="mr-1"
                                     style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                                    <div style={{display: this.state.selected.length <= 1 ? 'none' : 'block'}}>

                                        {/*<FilterTagInput tagsDBProvider={() => this.props.repoDocMetaManager!.tagsDB}*/}
                                                        {/*refresher={() => this.refresh()}*/}
                                                        {/*disabled={this.state.selected.length === 0}*/}
                                                        {/*filteredTags={this.filteredTags} />*/}

                                        <TagButton id="tag-multiple-documents"
                                                   tagsDBProvider={() => this.props.repoDocMetaManager!.tagsDB}
                                                   onSelectedTags={tags => this.onMultiTagged(tags)}/>


                                        <SimpleTooltip target="tag-multiple-documents"
                                                       placement="bottom">

                                            Tag multiple documents at once.  To
                                            fidn untagged documents sort by the
                                            'Tags' column (twice).  Once to sort
                                            alphabetically and the second click
                                            click will reverse the sort showing
                                            untagged documents.

                                        </SimpleTooltip>

                                    </div>

                                </div>

                            </div>

                            <div style={{width: '100%'}}>

                                <div style={{display: 'flex', justifyContent: 'flex-end'}}>

                                    <div className="mr-2"
                                         style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                                        <div className="checkbox-group">

                                            <ToggleButton id="toggle-flagged"
                                                          label="flagged"
                                                          initialValue={false}
                                                          onChange={value => this.onToggleFlaggedOnly(value)}/>

                                            <SimpleTooltip target="toggle-flagged">Toggle showing flagged documents</SimpleTooltip>

                                        </div>

                                    </div>

                                    <div className="header-filter-box mr-1"
                                         style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                                        <div className="checkbox-group">

                                            <ToggleButton id="toggle-archived"
                                                          label="archived"
                                                          initialValue={false}
                                                          onChange={value => this.onToggleFilterArchived(!value)}/>

                                            <SimpleTooltip target="toggle-archived">Toggle showing archived documents</SimpleTooltip>

                                        </div>

                                    </div>

                                    <div className="header-filter-box header-filter-tags mr-1"
                                         style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                                        <FilterTagInput id="filter-tag-input"
                                                        tagsDBProvider={() => this.props.repoDocMetaManager!.tagsDB}
                                                        refresher={() => this.refresh()}
                                                        filteredTags={this.filteredTags} />

                                        <SimpleTooltip target="filter-tag-input">Filter the document list by a specific tag.</SimpleTooltip>

                                    </div>


                                    <div className="header-filter-box mr-1"
                                         style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                                        <div className="header-filter-box">

                                            <InputGroup size="sm">

                                                {/*<InputGroupAddon addonType="prepend">*/}
                                                {/*A*/}
                                                {/*</InputGroupAddon>*/}

                                                <Input id="filter_title"
                                                       type="text"
                                                       placeholder="Filter by title"
                                                       onChange={() => this.onFilterByTitle()}/>

                                                <SimpleTooltip target="filter_title">Filter the document list by the title of the document.</SimpleTooltip>

                                            </InputGroup>

                                        </div>

                                    </div>



                                    <div className=""
                                         style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                                        <DocRepoTableDropdown id="table-dropdown"
                                                              options={Object.values(this.state.columns)}
                                                              onSelectedColumns={() => this.onSelectedColumns()}/>
                                    </div>

                                </div>

                            </div>

                        </div>



                    </div>

                    <MessageBanner/>

                </header>

                <FixedNavBody>
                    <div id="doc-table" style={{height: '100%'}}>
                        <ReactTable
                            data={data}
                            ref={(r: any) => this.reactTable = r}
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

                                        sortMethod: (a: RepoDocInfo, b: RepoDocInfo) => {

                                            const toSTR = (obj: any): string => {

                                                if (! obj) {
                                                    return "";
                                                }

                                                if (typeof obj === 'string') {
                                                    return obj;
                                                }

                                                return JSON.stringify(obj);

                                            };

                                            const cmp = toSTR(a.tags).localeCompare(toSTR(b.tags));

                                            if (cmp !== 0) {
                                                return cmp;
                                            }

                                            // for ties use the date added...
                                            return toSTR(a.added).localeCompare(toSTR(b.added));

                                        },
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
                                                <TagInput availableTags={this.props.repoDocMetaManager!.tagsDB.tags()}
                                                          existingTags={existingTags}
                                                          relatedTags={this.props.repoDocMetaManager!.relatedTags}
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

                            defaultPageSize={50}
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

                                    onClick: (event: MouseEvent) => {
                                        // console.log(`doc fingerprint:
                                        // ${rowInfo.original.fingerprint} and
                                        // filename
                                        // ${rowInfo.original.filename}`);
                                        this.selectRow(rowInfo.viewIndex as number, event);
                                    },

                                    style: {
                                        // TODO: dark-mode.  Use CSS variable
                                        // names for colors

                                        background: rowInfo && this.state.selected.includes(rowInfo.viewIndex) ? '#00afec' : 'white',
                                        color: rowInfo && this.state.selected.includes(rowInfo.viewIndex) ? 'white' : 'black',
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
                                                // needed for react table to
                                                // function properly.
                                                handleOriginal();
                                            }

                                        })

                                    };

                                }

                                return {};

                            }}

                        />
                    </div>

                </FixedNavBody>


            </FixedNav>

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

                settings = {
                    ...settings,
                    documentRepository: {
                        columns: this.state.columns
                    }
                };

                SettingsStore.write(settings)
                    .catch(err => log.error(err));

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

    private cmdImportFromDisk() {

        const mainAppController = remote.getGlobal('mainAppController');

        mainAppController.cmdImport()
            .catch((err: Error) => log.error("Could not import from disk: ", err));

    }

    private cmdCaptureWebPage() {

        const mainAppController = remote.getGlobal('mainAppController');

        mainAppController.cmdCaptureWebPageWithBrowser()
            .catch((err: Error) => log.error("Could not capture page: ", err));

    }

}

interface IProps {

    readonly persistenceLayerManager: PersistenceLayerManager;

    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;

    readonly repoDocMetaManager: RepoDocMetaManager;

    readonly repoDocMetaLoader: RepoDocMetaLoader;
}

interface IState {
    readonly data: RepoDocInfo[];
    readonly columns: DocRepoTableColumns;
    readonly selected: ReadonlyArray<number>;
}


