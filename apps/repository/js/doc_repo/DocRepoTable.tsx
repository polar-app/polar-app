import * as React from 'react';
import ReactTable, {Column, ColumnRenderProps, Instance, RowInfo} from "react-table";
import {Logger} from 'polar-shared/src/logger/Logger';
import {RepoDocInfo} from '../RepoDocInfo';
import {Tag, Tags} from 'polar-shared/src/tags/Tags';
import {DateTimeTableCell} from '../DateTimeTableCell';
import {RendererAnalytics} from '../../../../web/js/ga/RendererAnalytics';
import {SynchronizingDocLoader} from '../util/SynchronizingDocLoader';
import ReleasingReactComponent from '../framework/ReleasingReactComponent';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import Input from 'reactstrap/lib/Input';
import {DocContextMenuProps} from '../DocContextMenu';
import {Toaster} from '../../../../web/js/ui/toaster/Toaster';
import {Either} from '../../../../web/js/util/Either';
import {BackendFileRefs} from '../../../../web/js/datastore/BackendFileRefs';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {RelatedTags} from '../../../../web/js/tags/related/RelatedTags';
import {Numbers} from "polar-shared/src/util/Numbers";
import {
    ContextMenuHandlers,
    ContextMenuWrapper,
    prepareContextMenuHandlers
} from '@burtonator/react-context-menu-wrapper';
import {DocDropdownItems, OnRemoveFromFolderCallback} from "../DocDropdownItems";
import {Filters} from "./DocRepoFilters";
import {SelectRowType} from "./DocRepoScreen";
import {TitleCell} from "./cells/TitleCell";
import {CheckCell} from "./cells/CheckCell";
import {DocButtonsCell} from "./cells/DocButtonsCell";
import {ReactTableRowInfo} from "../../../../web/js/ui/react-table/ReactTables";
import {RepoDocInfos} from "../RepoDocInfos";
import {DocRepoTableColumnsMap} from "./DocRepoTableColumns";
import {Devices} from "../../../../web/js/util/Devices";
import {ReactTablePaginationPropsFactory} from "../../../../web/js/ui/react-table/paginators/ReactTablePaginationProps";
import {Checkbox} from "../../../../web/js/ui/Checkbox";

const log = Logger.create();

// TODO: go back to ExtendedReactTable

const CONTEXT_MENU_ID = 'doc-table-context-menu';


export class DocRepoTable extends ReleasingReactComponent<DocRepoTableProps, IState> {

    private contextMenuProps: DocContextMenuProps;

    constructor(props: DocRepoTableProps, context: any) {
        super(props, context);

        this.contextMenuProps = {
            getSelected: this.props.getSelected,
            onDelete: this.props.onDocDeleteRequested,
            onSetTitle: this.props.onDocSetTitle,
            onDocumentLoadRequested: (repoDocInfo: RepoDocInfo) => {
                this.onDocumentLoadRequested(repoDocInfo);
            },
            onRemoveFromFolder: this.props.onRemoveFromFolder
        };

        this.createColumnCheckbox = this.createColumnCheckbox.bind(this);
        this.createColumnTitle = this.createColumnTitle.bind(this);
        this.createColumnUpdated = this.createColumnUpdated.bind(this);
        this.createColumnAdded = this.createColumnAdded.bind(this);
        this.createColumnSite = this.createColumnSite.bind(this);
        this.createColumnTags = this.createColumnTags.bind(this);
        this.createColumnProgress = this.createColumnProgress.bind(this);
        this.createColumnAnnotations = this.createColumnAnnotations.bind(this);
        this.createColumnButtons = this.createColumnButtons.bind(this);

        this.createColumns = this.createColumns.bind(this);
        this.createColumnsForTablet = this.createColumnsForTablet.bind(this);
        this.createColumnsForDesktop = this.createColumnsForDesktop.bind(this);


        this.createTDProps = this.createTDProps.bind(this);
        this.createTDPropsForMobile = this.createTDPropsForMobile.bind(this);
        this.createTDPropsForDesktop = this.createTDPropsForDesktop.bind(this);

        this.createContextMenuHandlers = this.createContextMenuHandlers.bind(this);

        this.doHandleToggleField = this.doHandleToggleField.bind(this);

        this.state = {
            pageSize: 50
        };

    }

    private createColumnCheckbox() {

        return {

            id: 'doc-checkbox',
            Header: (col: ColumnRenderProps) => {
                // TODO: move to a PureComponent to
                // improve performance

                const checked = this.props.selected.length === col.data.length && col.data.length > 0;

                return (<div>

                    <Checkbox checked={checked}
                           style={{
                               margin: 'auto',
                               fontSize: '1.2em'
                           }}
                           className="m-auto"
                           onClick={() => {
                               // noop... now do we
                               // select ALL the
                               // items in the
                               // state now

                               const computeSelected = (): ReadonlyArray<number> => {

                                   if (this.props.selected.length !== col.data.length) {
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

                               this.props.onSelected(selected);

                           }}/>

                </div>);
            },
            accessor: '',
            maxWidth: 25,
            defaultSortDesc: true,
            resizable: false,
            sortable: false,
            className: 'doc-checkbox',
            style: {
                display: 'flex'
            },
            Cell: (row: any) => {
                // TODO: move to a PureComponent to
                // improve performance

                const viewIndex = row.viewIndex as number;

                return <CheckCell viewIndex={viewIndex}
                                  selected={this.props.selected}
                                  selectRow={this.props.selectRow}/>;
            }
        };

    }

    private createColumnTitle() {

        return {
            Header: 'Title',
            accessor: 'title',
            className: 'doc-table-col-title',
            Cell: (row: any) => {

                const id = 'doc-repo-row-title' + row.index;

                return (
                    <TitleCell id={id} title={row.value}/>
                );
            }

        };

    }

    private createColumnUpdated() {

        return {
            Header: 'Updated',
            // accessor: (row: any) => row.added,
            headerClassName: "d-none-mobile",
            accessor: 'lastUpdated',
            show: this.props.columns.lastUpdated.selected,
            maxWidth: 85,
            defaultSortDesc: true,
            className: 'doc-table-col-updated d-none-mobile',
            Cell: (row: any) => {

                return (

                    <DateTimeTableCell className="doc-col-last-updated" datetime={row.value}/>

                );
            }

        };

    }

    private createColumnAdded() {

        return {
            Header: 'Added',
            accessor: 'added',
            headerClassName: "d-none-mobile",
            show: this.props.columns.added.selected,
            maxWidth: 85,
            defaultSortDesc: true,
            className: 'doc-table-col-added d-none-mobile',
            Cell: (row: any) => {

                return (
                    <DateTimeTableCell className="doc-col-added" datetime={row.value}/>
                );
            }
        };

    }

    private createColumnSite() {

        return {
            Header: 'Site',
            accessor: 'site',
            headerClassName: "d-none-mobile",
            show: (this.props.columns.site || {}).selected || false,
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

                return toSTR(a).localeCompare(toSTR(b));

            },
        };

    }

    private createColumnTags() {

        const formatRecord = (repoDocInfo: RepoDocInfo): string => {

            const tags: { [id: string]: Tag } = repoDocInfo.tags || {};

            return Tags.onlyRegular(Object.values(tags))
                .map(tag => tag.label)
                .sort()
                .join(", ");

        };

        const sortMethod = (a: RepoDocInfo, b: RepoDocInfo) => {
            return RepoDocInfos.sort(a, b, formatRecord);
        };

        return {
            id: 'tags',
            Header: 'Tags',
            headerClassName: "d-none-mobile",
            width: 250,
            show: this.props.columns.tags.selected,
            className: 'doc-table-col-tags d-none-mobile',
            accessor: '',
            sortMethod: (a: RepoDocInfo, b: RepoDocInfo) => sortMethod(a, b),
            Cell: (value: ReactTableRowInfo<RepoDocInfo>) => formatRecord(value.original)
        };

    }

    private createColumnFolders() {

        const formatRecord = (repoDocInfo: RepoDocInfo): string => {

            const tags: { [id: string]: Tag } = repoDocInfo.tags || {};

            return Tags.onlyFolderTags(Object.values(tags))
                .map(tag => tag.label)
                .sort()
                .join(", ");

        };

        const sortMethod = (a: RepoDocInfo, b: RepoDocInfo) => {
            return RepoDocInfos.sort(a, b, formatRecord);
        };

        return {
            id: 'folders',
            Header: 'Folders',
            headerClassName: "d-none-mobile",
            width: 250,
            show: this.props.columns.folders?.selected || false,
            className: 'doc-table-col-folders d-none-mobile',
            accessor: '',
            sortMethod: (a: RepoDocInfo, b: RepoDocInfo) => sortMethod(a, b),
            Cell: (value: ReactTableRowInfo<RepoDocInfo>) => formatRecord(value.original)
        };

    }

    private createColumnProgress() {

        return {
            id: 'progress',
            Header: 'Progress',
            headerClassName: "d-none-mobile",
            accessor: 'progress',
            show: this.props.columns.progress.selected,
            maxWidth: 100,
            defaultSortDesc: true,
            resizable: false,
            className: 'doc-table-col-progress d-none-mobile',
            Cell: (row: any) => {

                return (
                    <progress className="mt-auto mb-auto" max="100" value={ row.value } style={{
                        width: '100%'
                    }} />
                );
            }
        };

    }

    private createColumnAnnotations() {

        return {
            id: 'nrAnnotations',
            Header: 'Annotations',
            headerClassName: "d-none-mobile",
            accessor: 'nrAnnotations',
            maxWidth: 110,
            show: this.props.columns.nrAnnotations.selected,
            defaultSortDesc: true,
            resizable: false,
            className: "d-none-mobile",
        };

    }

    private createColumnButtons() {

        return {
            id: 'doc-buttons',
            Header: '',
            headerClassName: "",
            accessor: '',
            maxWidth: Devices.isDesktop() ? 100 : 35,
            defaultSortDesc: true,
            resizable: false,
            sortable: false,
            className: 'doc-dropdown',
            Cell: (row: any) => {

                const repoDocInfo: RepoDocInfo = row.original;
                const viewIndex = row.viewIndex;

                return <DocButtonsCell viewIndex={viewIndex}
                                       flagged={repoDocInfo.flagged}
                                       archived={repoDocInfo.archived}
                                       doHandleToggleField={this.doHandleToggleField}
                                       onDocumentLoadRequested={this.onDocumentLoadRequested}
                                       {...this.props}/>;

            }
        };

    }

    private createColumns(contextMenuHandlers: ContextMenuHandlers) {

        if (Devices.get() === 'desktop') {
            return this.createColumnsForDesktop();
        } else {
            return this.createColumnsForTablet();
        }

    }

    private createColumnsForTablet() {

        return [
            this.createColumnCheckbox(),
            this.createColumnTitle(),
            this.createColumnProgress(),
            this.createColumnButtons()
        ];

    }

    private createColumnsForDesktop() {

        return [
            this.createColumnCheckbox(),
            this.createColumnTitle(),
            this.createColumnUpdated(),
            this.createColumnAdded(),
            this.createColumnSite(),
            this.createColumnTags(),
            this.createColumnFolders(),
            this.createColumnAnnotations(),
            this.createColumnProgress(),
            this.createColumnButtons()
        ];

    }

    private createTDProps(rowInfo: RowInfo, column: Column, contextMenuHandlers: ContextMenuHandlers) {

        if (Devices.get() === 'desktop') {
            return this.createTDPropsForDesktop(rowInfo, column, contextMenuHandlers);
        } else {
            return this.createTDPropsForMobile(rowInfo, column);
        }

    }

    private createTDPropsForMobile(rowInfo?: RowInfo, column?: Column) {

        const DEFAULT_BEHAVIOR_COLUMNS = [
            'doc-dropdown',
            'doc-buttons',
            'doc-checkbox'
        ];

        if (column && column.id && DEFAULT_BEHAVIOR_COLUMNS.includes(column.id)) {

            return {

                onClick: ((e: any, handleOriginal?: () => void) => {

                    if (handleOriginal) {
                        // needed for react table to
                        // function properly.
                        handleOriginal();
                    }

                })

            };

        } else {

            return {

                onClick: (event: MouseEvent) => {

                    if (rowInfo) {
                        const repoDocInfo: RepoDocInfo = rowInfo.original;
                        this.onDocumentLoadRequested(repoDocInfo);
                    }

                },

            };

        }

    }

    private createTDPropsForDesktop(rowInfo: RowInfo, column: Column, contextMenuHandlers: ContextMenuHandlers) {

        const DEFAULT_BEHAVIOR_COLUMNS = [
            'tag-input',
            'flagged',
            'archived',
            'doc-dropdown',
            'doc-buttons',
            'doc-checkbox'
        ];

        if (column && column.id && DEFAULT_BEHAVIOR_COLUMNS.includes(column.id)) {

            return {

                onClick: ((e: any, handleOriginal?: () => void) => {

                    if (handleOriginal) {
                        // needed for react table to
                        // function properly.
                        handleOriginal();
                    }

                })

            };

        } else {

            const handleSelect = (event: MouseEvent, type: SelectRowType) => {
                if (rowInfo) {
                    this.props.selectRow(rowInfo.viewIndex as number, event, type);
                }
            };

            return {

                onDoubleClick: () => {
                    const selected = this.props.getSelected();
                    if (selected.length === 1) {
                        // only allow double click if one item is requested.  Double clicking on > 1 makes
                        // no sense.
                        this.onDocumentLoadRequested(selected[0]);
                    }
                },

                onContextMenu: (event: MouseEvent) => {
                    handleSelect(event, 'context');
                    contextMenuHandlers.onContextMenu(event);
                },

                onClick: (event: MouseEvent, handleOriginal?: () => void) => {
                    handleSelect(event, 'click');
                },

                onTouchEnd: (event: TouchEvent) => {
                    contextMenuHandlers.onTouchEnd(event);
                },

                onTouchStart: (event: TouchEvent) => {
                    contextMenuHandlers.onTouchStart(event);
                }

            };

        }

    }

    private createContextMenuHandlers() {
        return prepareContextMenuHandlers({id: CONTEXT_MENU_ID});
    }

    public render() {

        const { data } = this.props;

        const contextMenuHandlers = this.createContextMenuHandlers();

        const onNextPage = () => this.setState({
            ...this.state,
            pageSize: this.state.pageSize + 50
        });

        const reactTableProps = ReactTablePaginationPropsFactory.create(onNextPage);

        return (

            <div id="doc-table"
                 className=""
                 style={{
                     height: '100%',
                     overflow: 'auto'
                 }}>

                {/*TODO: removing now because it breaks scrollbars for new users.*/}
                {/*<AccountUpgradeBar/>*/}

                <ContextMenuWrapper id={CONTEXT_MENU_ID}>

                    <div className="border shadow rounded pt-2 pb-2"
                         style={{backgroundColor: 'var(--primary-background-color)'}}>

                        <DocDropdownItems toggle={false}
                                          filters={this.props.filters}
                                          {...this.contextMenuProps}/>

                    </div>

                </ContextMenuWrapper>

                <ReactTable
                    data={[...data]}
                    ref={(reactTable: Instance) => this.props.onReactTable(reactTable)}
                    {...reactTableProps}
                    columns={this.createColumns(contextMenuHandlers)}
                    pageSize={this.state.pageSize}
                    noDataText="No documents available."
                    className="-striped -highlight"
                    showPageSizeOptions={false}
                    defaultSorted={[
                        {
                            id: "progress",
                            desc: true
                        }
                    ]}
                    getTheadProps={() => {
                        return {
                            style: {
                                // needed to avoid the columns being placed wrong due to the scrollbar.
                                paddingRight: '1em'
                            }
                        };
                    }}
                    getTrProps={(state: any, rowInfo: any) => {

                        const computeStyle = (): React.CSSProperties => {

                            const computeRowSelectionStyle = () => {

                                if (rowInfo) {

                                    if (this.props.selected.includes(rowInfo.viewIndex)) {
                                        return {
                                            background: 'var(--selected-background-color)',
                                            color: 'var(--selected-text-color)'
                                        };
                                    } else {

                                        const even = (rowInfo.viewIndex % 2) === 0;

                                        if (even) {
                                            return {
                                                background: 'var(--grey050)'
                                            };
                                        } else {
                                            return {
                                                background: 'var(--primary-background-color)'
                                            };
                                        }

                                    }

                                } else {
                                    return {
                                        background: 'var(--primary-background-color)'
                                    };
                                }

                            };

                            const computeFlaggedStyle = (): React.CSSProperties => {

                                if (rowInfo && rowInfo.original && rowInfo.original.flagged) {
                                    return {
                                        fontWeight: 'bold'
                                    };
                                }

                                return {};
                            };

                            return {
                                ...computeRowSelectionStyle(),
                                ...computeFlaggedStyle()
                            };


                        };

                        const style = computeStyle();

                        return {

                            draggable: true,
                            onDragStart: (event: DragEvent) => (this.props.onDragStart || NULL_FUNCTION)(event),
                            onDragEnd: (event: DragEvent) => (this.props.onDragEnd || NULL_FUNCTION)(event),

                            // include the doc fingerprint in the table
                            // so that the tour can use
                            'data-doc-fingerprint': ((rowInfo || {}).original || {}).fingerprint || '',

                            tabIndex: rowInfo ? (rowInfo.viewIndex as number) + 1 : undefined,

                            style,

                            onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
                                this.onKeyDown(event);
                            },

                        };
                    }}
                    getTdProps={(state: any, rowInfo?: RowInfo, column?: Column) => {

                        if (!rowInfo || ! column) {
                            return {};
                        }

                        return this.createTDProps(rowInfo, column, contextMenuHandlers);
                    }}

                />
            </div>

        );
    }

    private onKeyDown(event: React.KeyboardEvent<HTMLElement>) {

        if (event.key === "Delete") {
            this.props.onMultiDeleted();
        }

    }

    private onDocumentLoadRequested(repoDocInfo: RepoDocInfo) {

        const fingerprint = repoDocInfo.fingerprint;

        const docInfo = repoDocInfo.docInfo;
        const backendFileRef = BackendFileRefs.toBackendFileRef(Either.ofRight(docInfo));

        this.props.synchronizingDocLoader.load(fingerprint, backendFileRef!)
            .catch(err => log.error("Unable to load doc: ", err));

    }

    private doHandleToggleField(repoDocInfo: RepoDocInfo, field: string) {

        this.handleToggleField(repoDocInfo, field)
            .catch(err => {
                log.error(`Could not handle toggle on field: ${field}: `, err);
            });

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

            await this.props.writeDocInfo(repoDocInfo.docInfo)
                .catch(err => log.error("Failed to write DocInfo", err));

            this.props.refresh();
        }

    }

}

export interface DocRepoTableProps {
    readonly columns: DocRepoTableColumnsMap;
    readonly selected: ReadonlyArray<number>;
    readonly data: ReadonlyArray<RepoDocInfo>;
    readonly relatedTags: RelatedTags;
    readonly synchronizingDocLoader: SynchronizingDocLoader;
    readonly tagsProvider: () => ReadonlyArray<Tag>;
    readonly writeDocInfoTags: (repoDocInfo: RepoDocInfo, tags: ReadonlyArray<Tag>) => void;
    readonly deleteDocInfo: (repoDocInfo: RepoDocInfo) => void;
    readonly writeDocInfoTitle: (repoDocInfo: RepoDocInfo, title: string) => Promise<void>;
    readonly writeDocInfo: (docInfo: IDocInfo) => Promise<void>;
    readonly onMultiDeleted: () => void;
    readonly onDocDeleted: (repoDocInfos: RepoDocInfo[]) => void;
    readonly onDocDeleteRequested: (repoDocInfos: ReadonlyArray<RepoDocInfo>) => void;
    readonly onDocTagged: (repoDocInfo: RepoDocInfo, tags: ReadonlyArray<Tag>) => void;
    readonly onDocSetTitle: (repoDocInfo: RepoDocInfo, title: string) => void;
    readonly selectRow: (selectedIdx: number, event: MouseEvent, type: SelectRowType) => void;
    readonly onSelected: (selected: ReadonlyArray<number>) => void;
    readonly onReactTable: (reactTable: Instance) => void;
    readonly refresh: () => void;
    readonly onDragStart?: (event: DragEvent) => void;
    readonly onDragEnd?: (event: DragEvent) => void;
    readonly getSelected: () => ReadonlyArray<RepoDocInfo>;
    readonly filters: Filters;
    readonly onRemoveFromFolder: OnRemoveFromFolderCallback;
    readonly getRow: (viewIndex: number) => RepoDocInfo;
}

interface IState {
    readonly pageSize: number;
}


