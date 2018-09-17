import * as React from 'react';
import ReactTable from "react-table";
import {Footer, Tips} from './Utils';
import {Logger} from '../../../web/js/logger/Logger';
import {DocLoader} from '../../../web/js/apps/main/ipc/DocLoader';
import {Progress} from '../../../web/js/util/Progress';
import {Strings} from '../../../web/js/util/Strings';
import {IListenablePersistenceLayer} from '../../../web/js/datastore/IListenablePersistenceLayer';
import {RepoDocInfoLoader} from './RepoDocInfoLoader';
import {IAppState} from './IAppState';
import {RepoDocInfoIndex} from './RepoDocInfoIndex';
import {RepoDocInfo} from './RepoDocInfo';
import {RepoDocInfos} from './RepoDocInfos';
import {RepositoryUpdater} from './RepositoryUpdater';
import {RemotePersistenceLayerFactory} from '../../../web/js/datastore/factories/RemotePersistenceLayerFactory';
import {Popover, PopoverBody} from 'reactstrap';
import CreatableSelect from 'react-select/lib/Creatable';
import {TagInput} from './TagInput';
import {TagsDB} from './TagsDB';

const log = Logger.create();

export default class App<P> extends React.Component<{}, IAppState> {

    private persistenceLayer?: IListenablePersistenceLayer;

    private repoDocInfoLoader?: RepoDocInfoLoader;

    private repositoryUpdater?: RepositoryUpdater;

    private repoDocs: RepoDocInfoIndex = {};

    private tagsDB: TagsDB = new TagsDB();

    constructor(props: P, context: any) {
        super(props, context);

        this.state = {
            data: []
        };

        (async () => {

            await this.init();
            this.repoDocs = await this.repoDocInfoLoader!.load();

            this.refresh();

        })().catch(err => log.error("Could not load disk store: ", err));

    }

    public refresh() {
        this.refreshState(this.filterRepoDocInfos(Object.values(this.repoDocs)));
    }

    private refreshState(repoDocs: RepoDocInfo[]) {

        const state: IAppState = Object.assign({}, this.state);

        state.data = repoDocs;

        setTimeout(() => {

            // The react table will not update when I change the state from within
            // the event listener
            this.setState(state);

        }, 0);

    }

    private filterRepoDocInfos(repoDocs: RepoDocInfo[]): RepoDocInfo[] {

        // always filter valid to make sure nothing corrupts the state.  Some
        // other bug might inject a problem otherwise.
        repoDocs = this.doFilterValid(repoDocs);
        repoDocs = this.doFilterByTitle(repoDocs);
        repoDocs = this.doFilterFlaggedOnly(repoDocs);
        repoDocs = this.doFilterHideArchived(repoDocs);
        return repoDocs;
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

        const filterElement = document.querySelector("#filter_flagged") as HTMLInputElement;

        if (filterElement.checked) {
            return repoDocs.filter(current => current.flagged);
        }

        return repoDocs;

    }



    private doFilterHideArchived(repoDocs: RepoDocInfo[]): RepoDocInfo[] {

        const filterElement = document.querySelector("#filter_archived") as HTMLInputElement;

        if (filterElement.checked) {
            log.info("Applying archived filter");

            return repoDocs.filter(current => !current.archived);
        }

        return repoDocs;

    }


    public highlightRow(selected: number) {

        const state: IAppState = Object.assign({}, this.state);
        state.selected = selected;

        this.setState(state);

    }

    private onDocumentLoadRequested(fingerprint: string, filename: string ) {

        DocLoader.load({
            fingerprint,
            filename,
            newWindow: true
        }).catch(err => log.error("Unable to load doc: ", err));

    }

    private async handleToggleField(repoDocInfo: RepoDocInfo, field: string) {

        if (field === 'archived') {
            repoDocInfo.archived = !repoDocInfo.archived;
            repoDocInfo.docInfo.archived = repoDocInfo.archived;
        }

        if (field === 'flagged') {
            repoDocInfo.flagged = !repoDocInfo.flagged;
            repoDocInfo.docInfo.flagged = repoDocInfo.flagged;
        }

        await this.repositoryUpdater!.sync(repoDocInfo.docInfo);

        this.refresh();

    }

    public render() {
        const { data } = this.state;
        return (

            <div id="doc-repository">


                <header>

                    <div id="header-logo">
                        <img src="./img/icon.svg" height="25"/>
                    </div>

                    <div id="header-title">
                        <h1>Document Repository</h1>
                    </div>

                    <div id="header-filter">

                        <div className="header-filter-boxes">

                            <div className="header-filter-box">
                                <div className="checkbox-group">
                                    <input id="filter_flagged"
                                           type="checkbox"
                                           onChange={() => this.refresh()}/>
                                    <label htmlFor="filter_flagged">flagged only</label>
                                </div>
                            </div>

                            <div className="header-filter-box">
                                <div className="checkbox-group">
                                    <input id="filter_archived"
                                           defaultChecked
                                           type="checkbox"
                                           onChange={() => this.refresh()}/>

                                    <label htmlFor="filter_archived">hide archived</label>
                                </div>
                            </div>

                            <div className="header-filter-box">
                                <input id="filter_title"
                                       type="text"
                                       placeholder="Filter by title"
                                       onChange={() => this.refresh()}/>
                            </div>

                        </div>

                    </div>


                </header>

                <div id="doc-table">
                <ReactTable
                    data={data}
                    columns={
                        [
                            {
                                Header: 'Title',
                                accessor: 'title'
                                // style:
                            },
                            {
                                Header: 'Added',
                                // accessor: (row: any) => row.added,
                                accessor: 'added',
                                maxWidth: 200,
                                defaultSortDesc: true,
                                // Cell: (data: any) => (
                                //     <div>{Optional.of(data.value).getOrElse('')}</div>
                                // )
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
                                Header: 'Progress',
                                accessor: 'progress',
                                maxWidth: 200,
                                defaultSortDesc: true,
                                resizable: false,
                                Cell: (row: any) => (

                                    <progress max="100" value={ row.value } style={{
                                        width: '100%'
                                    }} />
                                )
                            },
                            {
                                Header: '',
                                accessor: '',
                                maxWidth: 25,
                                defaultSortDesc: true,
                                resizable: false,
                                Cell: (row: any) => {

                                    return (
                                        <TagInput/>
                                    );

                                }
                            },
                            {
                                Header: '',
                                accessor: 'flagged',
                                maxWidth: 25,
                                defaultSortDesc: true,
                                resizable: false,
                                Cell: (row: any) => {

                                    if (row.original.flagged) {
                                        return (
                                            <i className="fa fa-flag doc-button doc-button-active"/>
                                        );
                                    } else {
                                        return (
                                            <i className="fa fa-flag doc-button doc-button-inactive"/>
                                        );
                                    }

                                }
                            },
                            {
                                Header: '',
                                accessor: 'archived',
                                maxWidth: 25,
                                defaultSortDesc: true,
                                resizable: false,
                                Cell: (row: any) => {

                                    if (row.original.archived) {
                                        return (
                                            <i className="fa fa-check doc-button doc-button-active"/>
                                        );
                                    } else {
                                        return (
                                            <i className="fa fa-check doc-button doc-button-inactive"/>
                                        );
                                    }

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
                                this.highlightRow(rowInfo.index as number);
                            },

                            onDoubleClick: (e: any) => {
                                this.onDocumentLoadRequested(rowInfo.original.fingerprint, rowInfo.original.filename);
                            },

                            style: {
                                background: rowInfo && rowInfo.index === this.state.selected ? '#00afec' : 'white',
                                color: rowInfo && rowInfo.index === this.state.selected ? 'white' : 'black'
                            }
                        };
                    }}
                    getTdProps={(state: any, rowInfo: any, column: any, instance: any) => {

                        if (column.id === 'flagged' || column.id === 'archived') {

                            return {

                                onClick: ((e: any, handleOriginal?: () => void) => {

                                    this.handleToggleField(rowInfo.original, column.id)
                                        .catch(err => log.error("Could not handle toggle: ", err));

                                    if (handleOriginal) {
                                        // needed for react table to function properly.
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
            </div>
        );
    }

    private async init(): Promise<void> {

        this.persistenceLayer = await RemotePersistenceLayerFactory.create();
        this.repoDocInfoLoader = new RepoDocInfoLoader(this.persistenceLayer);
        this.repositoryUpdater = new RepositoryUpdater(this.persistenceLayer);

        this.persistenceLayer.addEventListener((event) => {

            log.info("Received DocInfo update");

            const repoDocInfo = RepoDocInfos.convertFromDocInfo(event.docInfo);

            if (RepoDocInfos.isValid(repoDocInfo)) {

                this.repoDocs[repoDocInfo.fingerprint] = repoDocInfo;
                this.refresh();

            } else {

                log.warn("We were given an invalid DocInfo which yielded a broken RepoDocInfo: ",
                         event.docInfo, repoDocInfo);

            }

        });

    }

}
