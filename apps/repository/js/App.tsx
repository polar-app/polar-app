import * as React from 'react';
import {DocDetail} from '../../../web/js/metadata/DocDetail';
import ReactTable from "react-table";
import {Logo, makeData, Tips} from './Utils';
import {DiskDatastore} from '../../../web/js/datastore/DiskDatastore';
import {Logger} from '../../../web/js/logger/Logger';
import {PersistenceLayer} from '../../../web/js/datastore/PersistenceLayer';
import {isPresent} from '../../../web/js/Preconditions';
import {Optional} from '../../../web/js/util/ts/Optional';

const log = Logger.create();

//import '../css/App.css';

// import logo from './logo.svg';



class App<P> extends React.Component<{}, IAppState> {

  // constructor(props: P, context: any) {
  //       super(props, context);
  //
  //     this.state = {
  //         docs: [
  //             {
  //                 fingerprint: '4e81fc6e-bfb6-419b-93e5-0242fb6f3f6a',
  //                 title: 'Mastering Bitcoin'
  //             },
  //             {
  //                 fingerprint: '11bbffc8-5891-4b45-b9ea-5c99aadf870f',
  //                 title: 'Etherium Whitepaper'
  //             }
  //         ]
  //     };
  //
  //     //this.addItems();
  //
  // }

    private diskDatastore?: DiskDatastore;
    private persistenceLayer?: PersistenceLayer;

    constructor(props: P, context: any) {
        super(props, context);

        this.state = {
            data: []
        };

        (async () => {

            await this.init();
            let docDetails = await this.load();

            docDetails = docDetails.filter(current => isPresent(current.filename));

            this.state.data.push(...docDetails);

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

                if(docMeta.docInfo) {

                    title = Optional.of(docMeta.docInfo.title).getOrElse('Untitled');
                    progress = Optional.of(docMeta.docInfo.progress).getOrElse(0);
                    filename = Optional.of(docMeta.docInfo.filename).getOrUndefined();

                }

                let doc = {
                    fingerprint: docMetaFile.fingerprint,
                    title,
                    progress,
                    filename
                };

                result.push(doc)

            }

        }

        return result;

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
                        <input type="text" placeholder="Filter by title"></input>
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
                            // {
                            //     Header: 'Last Name',
                            //     id: 'lastName',
                            //     accessor: (d: any) => d.lastName
                            // },
                            {
                                Header: 'Progress',
                                accessor: 'progress',
                                maxWidth: 200,
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
                    getTrProps={(state: any, rowInfo: any) => {
                        return {
                            // onClick: (e: any) => {
                            //     console.log(rowInfo);
                            //
                            //     let state: IAppState = Object.assign({}, this.state);
                            //     state.selected = rowInfo.index as number;
                            //
                            //     this.setState(state);
                            //     console.log("on click")
                            // },

                            onDoubleClick: (e: any) => {
                                console.log(rowInfo);

                                console.log("Going to open " + rowInfo.original.fingerprint);

                                // let state: IAppState = Object.assign({}, this.state);
                                // state.selected = rowInfo.index as number;
                                //
                                // this.setState(state);
                                // console.log("on click")
                            },

                            // style: {
                            //     background: rowInfo.index === this.state.selected ? '#00afec' : 'white',
                            //     color: rowInfo.index === this.state.selected ? 'white' : 'black'
                            // }
                        }
                    }}

                />
                <br />
                <Tips />
                <Logo />
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
