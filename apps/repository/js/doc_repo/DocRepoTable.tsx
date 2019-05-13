import * as React from 'react';
import ReactTable, {ColumnRenderProps} from "react-table";
import {Logger} from '../../../../web/js/logger/Logger';
import {RepoDocMetaLoader} from '../RepoDocMetaLoader';
import {RepoDocInfo} from '../RepoDocInfo';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {TagInput} from '../TagInput';
import {Optional} from '../../../../web/js/util/ts/Optional';
import {Tag} from '../../../../web/js/tags/Tag';
import {isPresent} from '../../../../web/js/Preconditions';
import {Tags} from '../../../../web/js/tags/Tags';
import {DateTimeTableCell} from '../DateTimeTableCell';
import {RendererAnalytics} from '../../../../web/js/ga/RendererAnalytics';
import {MessageBanner} from '../MessageBanner';
import {DocDropdown} from '../DocDropdown';
import {DocRepoTableDropdown} from './DocRepoTableDropdown';
import {DocRepoTableColumns} from './DocRepoTableColumns';
import {SettingsStore} from '../../../../web/js/datastore/SettingsStore';
import {RepoDocInfoIndex} from '../RepoDocInfoIndex';
import {IDocInfo} from '../../../../web/js/metadata/DocInfo';
import {SyncBarProgress} from '../../../../web/js/ui/sync_bar/SyncBar';
import {IEventDispatcher, SimpleReactor} from '../../../../web/js/reactor/SimpleReactor';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {RepoDocMetaLoaders} from '../RepoDocMetaLoaders';
import {PersistenceLayerManagers} from '../../../../web/js/datastore/PersistenceLayerManagers';
import {SynchronizingDocLoader} from '../util/SynchronizingDocLoader';
import ReleasingReactComponent from '../framework/ReleasingReactComponent';
import {Arrays} from '../../../../web/js/util/Arrays';
import {Numbers} from '../../../../web/js/util/Numbers';
import {TagButton} from './TagButton';
import {RepoHeader} from '../repo_header/RepoHeader';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {AddContentButton} from '../ui/AddContentButton';
import {ListOptionType} from '../../../../web/js/ui/list_selector/ListSelector';
import {NULL_FUNCTION} from '../../../../web/js/util/Functions';
import {DocButton} from '../ui/DocButton';
import {FlagDocButton} from '../ui/FlagDocButton';
import {ArchiveDocButton} from '../ui/ArchiveDocButton';
import {MultiDeleteButton} from './multi_buttons/MultiDeleteButton';
import {DocRepoFilterBar} from './DocRepoFilterBar';
import {DocRepoFilters, RefreshedCallback} from './DocRepoFilters';
import Input from 'reactstrap/lib/Input';
import {Settings} from '../../../../web/js/datastore/Settings';
import {AddContentActions} from '../ui/AddContentActions';
import {DocContextMenu} from '../DocContextMenu';
import {Toaster} from '../../../../web/js/ui/toaster/Toaster';
import {ProgressTracker} from '../../../../web/js/util/ProgressTracker';
import {ProgressMessages} from '../../../../web/js/ui/progress_bar/ProgressMessages';
import {Datastores} from '../../../../web/js/datastore/Datastores';
import {Either} from '../../../../web/js/util/Either';
import {BackendFileRefs} from '../../../../web/js/datastore/BackendFileRefs';
import {Dialogs} from '../../../../web/js/ui/dialogs/Dialogs';

const log = Logger.create();

// TODO: go back to ExtendedReactTable

export default class DocRepoTable extends ReleasingReactComponent<IProps, IState> {

    private static hasSentInitAnalyitics = false;

    private readonly persistenceLayerManager: PersistenceLayerManager;

    private readonly syncBarProgress: IEventDispatcher<SyncBarProgress> = new SimpleReactor();

    private readonly synchronizingDocLoader: SynchronizingDocLoader;

    private reactTable: any;

    private readonly docRepoFilters: DocRepoFilters;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.persistenceLayerManager = this.props.persistenceLayerManager;
        this.synchronizingDocLoader = new SynchronizingDocLoader(this.props.persistenceLayerManager);

        this.onDocDeleteRequested = this.onDocDeleteRequested.bind(this);

        this.onDocTagged = this.onDocTagged.bind(this);
        this.onDocDeleted = this.onDocDeleted.bind(this);
        this.onDocSetTitle = this.onDocSetTitle.bind(this);
        this.onSelectedColumns = this.onSelectedColumns.bind(this);

        this.onFilterByTitle = this.onFilterByTitle.bind(this);
        this.onToggleFilterArchived = this.onToggleFilterArchived.bind(this);
        this.onToggleFlaggedOnly = this.onToggleFlaggedOnly.bind(this);

        this.clearSelected = this.clearSelected.bind(this);

        this.onMultiTagged = this.onMultiTagged.bind(this);
        this.onMultiDeleted = this.onMultiDeleted.bind(this);

        this.getSelected = this.getSelected.bind(this);

        this.state = {
            data: [],
            columns: new DocRepoTableColumns(),
            selected: []
        };

        const onRefreshed: RefreshedCallback = repoDocInfos => this.doRefresh(repoDocInfos);

        const repoDocInfosProvider = () => Object.values(this.props.repoDocMetaManager!.repoDocInfoIndex);

        this.docRepoFilters =
            new DocRepoFilters(onRefreshed, repoDocInfosProvider);

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

        const settingProvider = await SettingsStore.load();

        log.info("Settings loaded: ", settingProvider);

        Optional.of(settingProvider().documentRepository)
            .map(current => current.columns)
            .when(columns => {

                // columns = Object.assign( new DocRepoTableColumns(), columns);

                log.info("Loaded columns from settings: ", columns);
                this.setState({...this.state, columns});
                this.refresh();

            });

        this.refresh();

    }

    private emitInitAnalytics(repoDocs: RepoDocInfoIndex) {

        // TODO: move some of these analytics into the main RepoaitoryApp.tsx.

        const nrDocs = Object.keys(repoDocs).length;

        RendererAnalytics.set({'nrDocs': nrDocs});

        const persistenceLayerType = this.persistenceLayerManager.currentType();

        RendererAnalytics.event({category: 'document-repository', action: `docs-loaded-${persistenceLayerType}-${nrDocs}`});

    }

    public selectRow(selectedIdx: number, event: MouseEvent, checkbox: boolean = false) {

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

        const selectIndividual = (event.getModifierState("Control") || event.getModifierState("Meta")) || checkbox;

        if (selectIndividual) {

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

    private onMultiDeleted() {
        const repoDocInfos = this.getSelected();
        this.onDocDeleteRequested(...repoDocInfos);
    }

    private clearSelected() {

        setTimeout(() => {
            this.setState({...this.state, selected: []});
        }, 1);

    }

    private getSelected(): RepoDocInfo[] {

        const resolvedState = this.reactTable!.getResolvedState();

        const sortedData = resolvedState.sortedData;

        const result: RepoDocInfo[] =
            this.state.selected
                .map(selectedIdx => sortedData[selectedIdx])
                .filter(item => isPresent(item))
                .map(item => item._original);

        return result;

    }

    public render() {
        const { data } = this.state;

        const contextMenuProps = {
            onDelete: this.onDocDeleteRequested,
            onSetTitle: this.onDocSetTitle,
            onDocumentLoadRequested: (repoDocInfo: RepoDocInfo) => {
                this.onDocumentLoadRequested(repoDocInfo);
            }

        };

        return (

            <FixedNav id="doc-repo-table">

                <header>


                    <RepoHeader persistenceLayerManager={this.props.persistenceLayerManager}/>

                    <div id="header-filter">

                        <div style={{display: 'flex'}}
                             className="mt-1 mb-1">

                            <div className=""
                                 style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto', display: 'flex'}}>

                                <div className="mr-1"
                                     style={{
                                         whiteSpace: 'nowrap',
                                         marginTop: 'auto',
                                         marginBottom: 'auto'
                                     }}>

                                    <AddContentButton importFromDisk={() => AddContentActions.cmdImportFromDisk()}
                                                      captureWebPage={() => AddContentActions.cmdCaptureWebPage()}/>

                                </div>


                                <div className="mr-1"
                                     style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                                    <div style={{display: 'flex'}}>

                                        {/*<FilterTagInput tagsDBProvider={() => this.props.repoDocMetaManager!.tagsDB}*/}
                                                        {/*refresher={() => this.refresh()}*/}
                                                        {/*disabled={this.state.selected.length === 0}*/}
                                                        {/*filteredTags={this.filteredTags} />*/}

                                        <div>

                                            <TagButton id="tag-multiple-documents"
                                                       disabled={this.state.selected.length <= 0}
                                                       tagsDBProvider={() => this.props.repoDocMetaManager!.tagsDB}
                                                       onSelectedTags={tags => this.onMultiTagged(tags)}/>

                                        </div>

                                        <div className="ml-1">
                                            <MultiDeleteButton disabled={this.state.selected.length <= 0}
                                                               onClick={() => this.onMultiDeleted()}/>
                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div style={{marginLeft: 'auto'}}>

                                <DocRepoFilterBar onToggleFlaggedOnly={value => this.onToggleFlaggedOnly(value)}
                                                  onToggleFilterArchived={value => this.onToggleFilterArchived(value)}
                                                  onFilterByTitle={(title) => this.onFilterByTitle(title)}
                                                  tagsDBProvider={() => this.props.repoDocMetaManager!.tagsDB}
                                                  refresher={() => this.refresh()}
                                                  filteredTags={this.docRepoFilters.filters.filteredTags}
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

                <FixedNavBody>
                    <div id="doc-table" className="ml-1" style={{height: '100%'}}>
                        <ReactTable
                            data={data}
                            ref={(r: any) => this.reactTable = r}
                            columns={
                                [
                                    {

                                        id: 'doc-checkbox',
                                        Header: (col: ColumnRenderProps) => {
                                            // TODO: move to a PureComponent to
                                            // improve performance

                                            const checked = this.state.selected.length === col.data.length && col.data.length > 0;

                                            return (<div>

                                                <Input checked={checked}
                                                       style={{
                                                           marginLeft: 'auto',
                                                           marginRight: 'auto',
                                                           margin: 'auto',
                                                           position: 'relative',
                                                           top: '2px',
                                                           width: '16px',
                                                           height: '16px',
                                                       }}
                                                       className="m-auto"
                                                       onChange={NULL_FUNCTION}
                                                       onClick={() => {
                                                           // noop... now do we
                                                           // select ALL the
                                                           // items in the
                                                           // state now

                                                           const computeSelected = (): ReadonlyArray<number> => {

                                                               if (this.state.selected.length !== col.data.length) {
                                                                   // all of
                                                                   // them
                                                                   return Numbers.range(0, col.data.length - 1);
                                                               } else {
                                                                   // none of
                                                                   // them
                                                                   return [];
                                                               }

                                                           };

                                                           const selected = computeSelected();

                                                           this.setState({...this.state, selected});

                                                       }}
                                                       type="checkbox"/>

                                            </div>);
                                        },
                                        accessor: '',
                                        maxWidth: 25,
                                        defaultSortDesc: true,
                                        resizable: false,
                                        sortable: false,
                                        className: 'doc-checkbox',
                                        Cell: (row: any) => {
                                            // TODO: move to a PureComponent to
                                            // improve performance

                                            const viewIndex = row.viewIndex as number;

                                            return (<div style={{lineHeight: '1em'}}>

                                                <Input checked={this.state.selected.includes(viewIndex)}
                                                       style={{
                                                           marginLeft: 'auto',
                                                           marginRight: 'auto',
                                                           margin: 'auto',
                                                           position: 'relative',
                                                           top: '2px',
                                                           width: '16px',
                                                           height: '16px',
                                                       }}
                                                       className="m-auto"
                                                       onChange={NULL_FUNCTION}
                                                       onClick={(event) => this.selectRow(viewIndex, event.nativeEvent, true)}
                                                       type="checkbox"/>

                                                {/*<i className="far fa-square"></i>*/}

                                            </div>);
                                        }
                                    },
                                    {
                                        Header: 'Title',
                                        accessor: 'title',
                                        className: 'doc-table-col-title',
                                        Cell: (row: any) => {

                                            const id = 'doc-repo-row-title' + row.index;
                                            const repoDocInfo: RepoDocInfo = row.original;

                                            return (

                                                <div id={id}>

                                                    <DocContextMenu {...contextMenuProps}
                                                                    id={'context-menu-' + row.index}
                                                                    repoDocInfo={repoDocInfo}>

                                                        <div>{row.value}</div>

                                                    </DocContextMenu>

                                                </div>

                                            );
                                        }

                                    },
                                    {
                                        Header: 'Updated',
                                        // accessor: (row: any) => row.added,
                                        headerClassName: "d-none-mobile",
                                        accessor: 'lastUpdated',
                                        show: this.state.columns.lastUpdated.selected,
                                        maxWidth: 85,
                                        defaultSortDesc: true,
                                        className: 'doc-table-col-updated d-none-mobile',
                                        Cell: (row: any) => {

                                            const repoDocInfo: RepoDocInfo = row.original;

                                            return (

                                                <DocContextMenu {...contextMenuProps}
                                                                id={'context-menu-' + row.index}
                                                                repoDocInfo={repoDocInfo}>

                                                    <DateTimeTableCell className="doc-col-last-updated" datetime={row.value}/>

                                                </DocContextMenu>

                                            );
                                        }

                                    },
                                    {
                                        Header: 'Added',
                                        accessor: 'added',
                                        headerClassName: "d-none-mobile",
                                        show: this.state.columns.added.selected,
                                        maxWidth: 85,
                                        defaultSortDesc: true,
                                        className: 'doc-table-col-added d-none-mobile',
                                        Cell: (row: any) => {

                                            const repoDocInfo: RepoDocInfo = row.original;

                                            return (

                                                <DocContextMenu {...contextMenuProps}
                                                                id={'context-menu-' + row.index}
                                                                repoDocInfo={repoDocInfo}>

                                                    <DateTimeTableCell className="doc-col-added" datetime={row.value}/>

                                                </DocContextMenu>

                                            );
                                        }
                                    },
                                    {
                                        Header: 'Site',
                                        accessor: 'site',
                                        headerClassName: "d-none-mobile",
                                        show: (this.state.columns.site || {}).selected || false,
                                        // show: false,
                                        maxWidth: 200,
                                        sortable: false,
                                        className: "d-none-mobile",
                                        sortMethod: (a: RepoDocInfo, b: RepoDocInfo) => {

                                            const toSTR = (doc?: RepoDocInfo): string => {

                                                if (! doc) {
                                                    return "";
                                                }

                                                if (doc.site) {
                                                    return doc.site;
                                                }

                                                return "";

                                            };

                                            const aSTR = toSTR(a);
                                            const bSTR = toSTR(b);

                                            // if (aSTR === bSTR) {
                                            //     return 0;
                                            // }
                                            //
                                            // if (aSTR === "") {
                                            //     return Number.MIN_VALUE;
                                            // }
                                            //
                                            // if (bSTR === "") {
                                            //     return Number.MAX_VALUE;
                                            // }

                                            return aSTR.localeCompare(bSTR);

                                        },
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
                                        headerClassName: "d-none-mobile",
                                        width: 250,
                                        accessor: '',
                                        show: this.state.columns.tags.selected,
                                        className: 'doc-table-col-tags d-none-mobile',
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
                                            // TODO: move to a PureComponent to
                                            // improve performance

                                            const tags: {[id: string]: Tag} = row.original.tags;

                                            const formatted = Object.values(tags)
                                                .map(tag => tag.label)
                                                .sort()
                                                .join(", ");

                                            const repoDocInfo: RepoDocInfo = row.original;

                                            return (

                                                <DocContextMenu {...contextMenuProps}
                                                                id={'context-menu-' + row.index}
                                                                repoDocInfo={repoDocInfo}>
                                                    <div>{formatted}</div>
                                                </DocContextMenu>

                                            );

                                        }
                                    },
                                    {
                                        id: 'nrAnnotations',
                                        Header: 'Annotations',
                                        headerClassName: "d-none-mobile",
                                        accessor: 'nrAnnotations',
                                        maxWidth: 110,
                                        show: this.state.columns.nrAnnotations.selected,
                                        defaultSortDesc: true,
                                        resizable: false,
                                        className: "d-none-mobile",
                                    },
                                    {
                                        id: 'progress',
                                        Header: 'Progress',
                                        headerClassName: "d-none-mobile",
                                        accessor: 'progress',
                                        show: this.state.columns.progress.selected,
                                        maxWidth: 100,
                                        defaultSortDesc: true,
                                        resizable: false,
                                        className: 'doc-table-col-progress d-none-mobile',
                                        Cell: (row: any) => {

                                            const repoDocInfo: RepoDocInfo = row.original;

                                            return (

                                                <DocContextMenu {...contextMenuProps}
                                                                id={'context-menu-' + row.index}
                                                                repoDocInfo={repoDocInfo}>

                                                    <progress className="mt-auto mb-auto" max="100" value={ row.value } style={{
                                                        width: '100%'
                                                    }} />

                                                </DocContextMenu>

                                            );
                                        }
                                    },
                                    {
                                        id: 'doc-buttons',
                                        Header: '',
                                        headerClassName: "d-none-mobile",
                                        accessor: '',
                                        maxWidth: 100,
                                        defaultSortDesc: true,
                                        resizable: false,
                                        sortable: false,
                                        className: 'doc-dropdown d-none-mobile',
                                        Cell: (row: any) => {

                                            const repoDocInfo: RepoDocInfo = row.original;

                                            const existingTags: Tag[]
                                                = Object.values(Optional.of(repoDocInfo.docInfo.tags).getOrElse({}));

                                            return (<div className="doc-buttons" style={{display: 'flex'}}>

                                                    <DocButton>

                                                        {/*WARNING: making this a function breaks the layout...*/}

                                                        <TagInput availableTags={this.props.repoDocMetaManager!.tagsDB.tags()}
                                                                  existingTags={existingTags}
                                                                  relatedTags={this.props.repoDocMetaManager!.relatedTags}
                                                                  onChange={(tags) =>
                                                                      this.onDocTagged(repoDocInfo, tags)
                                                                          .catch(err => log.error("Unable to update tags: ", err))}/>

                                                    </DocButton>

                                                    <FlagDocButton active={repoDocInfo.flagged}
                                                                   onClick={() => this.doHandleToggleField(repoDocInfo, 'flagged')}/>

                                                    <ArchiveDocButton active={repoDocInfo.archived}
                                                                      onClick={() => this.doHandleToggleField(repoDocInfo, 'archived')}/>

                                                    <DocButton>

                                                        <DocDropdown id={'doc-dropdown-' + row.index}
                                                                     repoDocInfo={repoDocInfo}
                                                                     onDelete={this.onDocDeleteRequested}
                                                                     onSetTitle={this.onDocSetTitle}
                                                                     onDocumentLoadRequested={contextMenuProps.onDocumentLoadRequested}/>

                                                    </DocButton>

                                                </div>);

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

                                    // include the doc fingerprint in the table
                                    // so that the tour can use
                                    'data-doc-fingerprint': ((rowInfo || {}).original || {}).fingerprint || '',

                                    tabIndex: rowInfo ? (rowInfo.viewIndex as number) + 1 : undefined,

                                    style: {
                                        // TODO: dark-mode.  Use CSS variable
                                        // names for colors

                                        background: rowInfo && this.state.selected.includes(rowInfo.viewIndex) ? 'var(--selected-background-color)' : 'var(--primary-background-color)',
                                        color: rowInfo && this.state.selected.includes(rowInfo.viewIndex) ? 'var(--selected-text-color)' : 'var(--primary-text-color)',
                                    },

                                    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
                                        this.onKeyDown(event);
                                    },

                                };
                            }}
                            getTdProps={(state: any, rowInfo: any, column: any, instance: any) => {

                                const SINGLE_CLICK_COLUMNS = [
                                    'tag-input',
                                    'flagged',
                                    'archived',
                                    'doc-dropdown',
                                    'doc-buttons',
                                    'doc-checkbox'
                                ];

                                if (! SINGLE_CLICK_COLUMNS.includes(column.id)) {

                                    const handleSelect = (event: MouseEvent) => {
                                        if (rowInfo) {
                                            this.selectRow(rowInfo.viewIndex as number, event);
                                        }
                                    };

                                    return {

                                        onDoubleClick: (event: MouseEvent) => {

                                            if (rowInfo) {
                                                const repoDocInfo: RepoDocInfo = rowInfo.original;
                                                this.onDocumentLoadRequested(repoDocInfo);
                                            }

                                        },

                                        onContextMenu: (event: MouseEvent) => {
                                            handleSelect(event);
                                        },

                                        onClick: (event: MouseEvent, handleOriginal?: () => void) => {
                                            handleSelect(event);
                                        },

                                    };

                                }

                                if (SINGLE_CLICK_COLUMNS.includes(column.id)) {

                                    return {

                                        onClick: ((e: any, handleOriginal?: () => void) => {

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

    private onKeyDown(event: React.KeyboardEvent<HTMLElement>) {

        if (event.key === "Delete") {
            this.onMultiDeleted();
        }

    }

    private async onDocTagged(repoDocInfo: RepoDocInfo, tags: Tag[]) {

        RendererAnalytics.event({category: 'user', action: 'doc-tagged'});

        await this.props.repoDocMetaManager!.writeDocInfoTags(repoDocInfo, tags);
        this.refresh();

    }

    private onDocDeleteRequested(...repoDocInfos: RepoDocInfo[]) {

        Dialogs.confirm({
            title: "Are you sure you want to delete these document(s)?",
            subtitle: "This is a permanent operation and can't be undone.  All associated annotations will also be removed.",
            onCancel: NULL_FUNCTION,
            onConfirm: () => this.onDocDeleted(...repoDocInfos),
        });

    }

    private onDocDeleted(...repoDocInfos: RepoDocInfo[]) {

        console.log("FIXME: deleting documents... ", repoDocInfos);

        const doDeletes = async () => {

            const stats = {
                successes: 0,
                failures: 0
            };

            this.clearSelected();

            const progressTracker = new ProgressTracker(repoDocInfos.length, 'delete');

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

    private onSelectedColumns(columns: ListOptionType[]) {

        RendererAnalytics.event({category: 'user', action: 'selected-columns'});

        // new columns have been selected. Note that the UI updates the values
        // directly so we can just write what's in memory to disk. I think it
        // would be better practice to keep them immutable.

        SettingsStore.load()
            .then((settingsProvider) => {

                const currentSettings = settingsProvider();

                const settings: Settings = {
                    ...currentSettings,
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
    private doRefresh(data: RepoDocInfo[]) {

        const state = {...this.state, data};

        setTimeout(() => {

            // The react table will not update when I change the state from
            // within the event listener
            this.setState(state);

        }, 1);

    }

    private onDocumentLoadRequested(repoDocInfo: RepoDocInfo) {

        const fingerprint = repoDocInfo.fingerprint;

        const docInfo = repoDocInfo.docInfo;
        const backendFileRef = BackendFileRefs.toBackendFileRef(Either.ofRight(docInfo));

        this.synchronizingDocLoader.load(fingerprint, backendFileRef!)
            .catch(err => log.error("Unable to load doc: ", err));

    }

    private doHandleToggleField(repoDocInfo: RepoDocInfo, field: string) {

        this.handleToggleField(repoDocInfo, field)
            .catch(err => log.error(`Could not handle toggle on field: ${field}: `, err));

    }


    private async handleToggleField(repoDocInfo: RepoDocInfo, field: string) {

        // TODO: move to syncDocInfoArchived in DocRepository

        let mutated: boolean = false;

        if (field === 'archived') {
            RendererAnalytics.event({category: 'user', action: 'archived-doc'});
            repoDocInfo.archived = !repoDocInfo.archived;
            repoDocInfo.docInfo.archived = repoDocInfo.archived;
            mutated = true;

            // used so the user can tell something actually happened because if
            // the row just vanishes it's hard to tell that something actually
            // changed.
            if (repoDocInfo.archived) {
                Toaster.success(`Document has been archived.`);
            }

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
        this.docRepoFilters.onToggleFlaggedOnly(value);
    }

    private onToggleFilterArchived(value: boolean) {
        this.docRepoFilters.onToggleFilterArchived(value);
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


