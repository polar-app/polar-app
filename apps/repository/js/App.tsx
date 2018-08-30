import * as React from 'react';
import {DocDetail} from '../../../web/js/metadata/DocDetail';
import ReactTable from "react-table";
import {Footer, Logo, Tips} from './Utils';
import {DiskDatastore} from '../../../web/js/datastore/DiskDatastore';
import {Logger} from '../../../web/js/logger/Logger';
import {PersistenceLayer} from '../../../web/js/datastore/PersistenceLayer';
import {isPresent} from '../../../web/js/Preconditions';
import {Optional} from '../../../web/js/util/ts/Optional';
import {DocLoader} from '../../../web/js/apps/main/ipc/DocLoader';
import {ISODateTime} from '../../../web/js/metadata/ISODateTime';

const log = Logger.create();

class App<P> extends React.Component<{}, IAppState> {

    private diskDatastore?: DiskDatastore;
    private persistenceLayer?: PersistenceLayer;

    private docDetails: DocDetail[] = [];

    constructor(props: P, context: any) {
        super(props, context);

        this.state = {
            data: []
        };

        (async () => {

            await this.init();
            this.docDetails = await this.load();

            this.docDetails = this.docDetails.filter(current => isPresent(current.filename));

            this.state.data.push(...this.docDetails);

            this.setState(this.state);

        })().catch(err => log.error("Could not load disk store: ", err));

    }

    private async init(): Promise<void> {

        let diskDatastore: DiskDatastore;
        let persistenceLayer: PersistenceLayer;

        this.diskDatastore = diskDatastore = new DiskDatastore();
        this.persistenceLayer = persistenceLayer = new PersistenceLayer(diskDatastore);

        await diskDatastore.init();

        await persistenceLayer.init();

    }

    private async load(): Promise<DocDetail[]> {

        let result: DocDetail[] = [];

        let docMetaFiles = await this.diskDatastore!.getDocMetaFiles();

        for (let i = 0; i < docMetaFiles.length; i++) {
            const docMetaFile = docMetaFiles[i];

            let docMeta = await this.persistenceLayer!.getDocMeta(docMetaFile.fingerprint);

            if(docMeta !== undefined) {

                let title: string = 'Untitled';
                let progress: number = 0;
                let filename: string | undefined;
                let added: ISODateTime | undefined;

                if(docMeta.docInfo) {

                    // TODO: consider using the filename if title absent.
                    title = Optional.of(docMeta.docInfo.title).getOrElse('Untitled');
                    progress = Optional.of(docMeta.docInfo.progress).getOrElse(0);
                    filename = Optional.of(docMeta.docInfo.filename).getOrUndefined();
                    added = Optional.of(docMeta.docInfo.added).getOrUndefined();
                    //added = "asdf"

                }

                let doc = {
                    fingerprint: docMetaFile.fingerprint,
                    title,
                    progress,
                    filename,
                    added
                };

                result.push(doc)

            }

        }

        return result;

    }

    doFilterByTitle() {

        let input = document.querySelector("#filter") as HTMLInputElement;

        let filterText = input.value;

        let state: IAppState = Object.assign({}, this.state);

        state.data = [];

        if(filterText === null || filterText === '') {
            // no filter
            state.data.push(...this.docDetails);
        } else {

            let filteredDocDetails =
                this.docDetails.filter(current => current.title && current.title.toLowerCase().indexOf(filterText!.toLowerCase()) >= 0 )

            state.data.push(...filteredDocDetails);

        }


        this.setState(state);

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
                        <input id="filter" type="text" placeholder="Filter by title" onChange={() => this.doFilterByTitle()}></input>
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
                                accessor: 'added',
                                maxWidth: 200,
                                defaultSortDesc: true
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
                                console.log(rowInfo);

                                let state: IAppState = Object.assign({}, this.state);
                                state.selected = rowInfo.index as number;

                                this.setState(state);
                                console.log("on click")
                            },
                            //
                            // onClick: (e: any) => {
                            //     console.log(rowInfo);
                            // },

                            onDoubleClick: (e: any) => {
                                console.log(rowInfo);

                                console.log("Going to open " + rowInfo.original.fingerprint);

                                DocLoader.load({
                                    fingerprint: rowInfo.original.fingerprint,
                                    filename: rowInfo.original.filename,
                                    newWindow: true
                                }).catch(err => log.error("Unable to load doc: ", err));

                                // let state: IAppState = Object.assign({}, this.state);
                                // state.selected = rowInfo.index as number;
                                //
                                // this.setState(state);
                                // console.log("on click")
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

/**
 * High level document representation extracted from DocInfo and DocMeta in the
 * repository but simpler for the UI.
 */
export interface IDoc {

    fingerprint: string,

    /**
     * The title of this document.
     */
    title?: string;

    /**
     * The link back to the original document, when available.
     */
    link?: string;

    source?: ISource;

    progress?: number

}

/**
 * The source of a document.  Specifically the title and link.
 */
export interface ISource {
    title: string;
    link: string;
}

interface IAppState {

    //docs: DocDetail[];

    data: DocDetail[];
    selected?: number;
}
