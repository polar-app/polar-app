import * as React from 'react';
import ReactTable from "react-table";
import {Footer, Tips} from './Utils';
import {Logger} from '../../../web/js/logger/Logger';
import {PersistenceLayer} from '../../../web/js/datastore/PersistenceLayer';
import {isPresent} from '../../../web/js/Preconditions';
import {Optional} from '../../../web/js/util/ts/Optional';
import {DocLoader} from '../../../web/js/apps/main/ipc/DocLoader';
import {Datastores} from '../../../web/js/datastore/Datastores';
import {Datastore} from '../../../web/js/datastore/Datastore';
import {Progress} from '../../../web/js/util/Progress';
import {DocMetaRef} from '../../../web/js/datastore/DocMetaRef';
import {ProgressBar} from '../../../web/js/ui/progress_bar/ProgressBar';

const log = Logger.create();

class App<P> extends React.Component<{}, IAppState> {

    private datastore?: Datastore;
    private persistenceLayer?: PersistenceLayer;

    private repoDocs: RepoDocInfo[] = [];

    constructor(props: P, context: any) {
        super(props, context);

        this.state = {
            data: []
        };

        (async () => {

            await this.init();
            this.repoDocs = await this.load();

            this.repoDocs = this.repoDocs.filter(current => {

                if(isPresent(current.filename)) {
                    return true;
                } else {
                    log.warn("Document filtered from repository view due to no filename: ",
                             current.fingerprint);
                    return false;
                }

            } );

            this.state.data.push(...this.repoDocs);

            this.setState(this.state);

        })().catch(err => log.error("Could not load disk store: ", err));

    }

    private async init(): Promise<void> {

        let datastore: Datastore;
        let persistenceLayer: PersistenceLayer;

        this.datastore = datastore = Datastores.create();
        this.persistenceLayer = persistenceLayer = new PersistenceLayer(datastore);

        await datastore.init();

        await persistenceLayer.init();

    }

    private async load(): Promise<RepoDocInfo[]> {

        let result: RepoDocInfo[] = [];

        let docMetaFiles = await this.datastore!.getDocMetaFiles();

        let progress = new Progress(docMetaFiles.length);

        let progressBar = ProgressBar.create(false);

        for (let i = 0; i < docMetaFiles.length; i++) {
            const docMetaFile = docMetaFiles[i];

            let repoDocInfo = await this.loadDocMeta(docMetaFile);
            if(repoDocInfo) {
                result.push(repoDocInfo)
            }

            progress.incr();
            progressBar.update(progress.percentage());

        }

        progressBar.destroy();

        return result;

    }

    private async loadDocMeta(docMetaFile: DocMetaRef): Promise<RepoDocInfo | undefined> {

        let docMeta = await this.persistenceLayer!.getDocMeta(docMetaFile.fingerprint);

        if(docMeta !== undefined) {

            if (docMeta.docInfo) {

                return {
                    fingerprint: docMetaFile.fingerprint,
                    title: Optional.of(docMeta.docInfo.title).getOrElse('Untitled'),
                    progress: Optional.of(docMeta.docInfo.progress).getOrElse(0),
                    filename: Optional.of(docMeta.docInfo.filename).getOrUndefined(),
                    added: Optional.of(docMeta.docInfo.added).map(current => current.value).getOrUndefined(),
                };

            } else {
                log.warn("No docInfo for file: ", docMetaFile.fingerprint);
            }

        } else {
            log.warn("No DocMeta for fingerprint: " + docMetaFile.fingerprint);
        }

        return undefined;

    }

    doFilterByTitle() {

        let input = document.querySelector("#filter") as HTMLInputElement;

        let filterText = input.value;

        let state: IAppState = Object.assign({}, this.state);

        state.data = [];

        if(filterText === null || filterText === '') {
            // no filter
            state.data.push(...this.repoDocs);
        } else {

            let filteredDocDetails =
                this.repoDocs.filter(current => current.title && current.title.toLowerCase().indexOf(filterText!.toLowerCase()) >= 0 )

            state.data.push(...filteredDocDetails);

        }


        this.setState(state);

    }

    public highlightRow(selected: number) {

        let state: IAppState = Object.assign({}, this.state);
        state.selected = selected;

        this.setState(state);

    }

    public loadDocument(fingerprint: string, filename: string ){

        console.log("Going to open " + fingerprint);

        DocLoader.load({
            fingerprint: fingerprint,
            filename: filename,
            newWindow: true
        }).catch(err => log.error("Unable to load doc: ", err));

    }

    render() {
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
                        <input id="filter" type="text" placeholder="Filter by title" onChange={() => this.doFilterByTitle()}/>
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
                                //style:
                            },
                            {
                                Header: 'Added',
                                //accessor: (row: any) => row.added,
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
                                Cell: (row: any) => (

                                    <progress max="100" value={ row.value } style={{
                                        width: '100%'
                                    }} />
                                )
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
                                this.loadDocument(rowInfo.original.fingerprint,rowInfo.original.filename);
                            },

                            style: {
                                background: rowInfo && rowInfo.index === this.state.selected ? '#00afec' : 'white',
                                color: rowInfo && rowInfo.index === this.state.selected ? 'white' : 'black'
                            }
                        }
                    }}

                />
                <br />
                <Tips />
                <Footer/>

                </div>
            </div>
        );
    }
}

export default App;

interface IAppState {

    //docs: DocDetail[];

    data: RepoDocInfo[];
    selected?: number;
}

