import * as React from 'react';
import {DocDetail} from '../../../web/js/metadata/DocDetail';
import ReactTable from "react-table";
import {Logo, makeData, Tips} from './Utils';

//import '../css/App.css';

// import logo from './logo.svg';


interface IAppState {

    //docs: DocDetail[];

    data: any;
}

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

    constructor(props: P, context: any) {
        super(props, context);

        this.state = {
            data: makeData()
        };
    }
    // public render() {
    //
    //     return (
    //         <div className="App">
    //
    //             <div className="docs">
    //
    //                 {this.state.docs.map(doc =>
    //
    //                     <div className="doc rounded" key={doc.fingerprint}>
    //
    //                         <div className="left">
    //
    //                             <div className="doc-thumb">
    //                                 <img src="..." alt="" className="doc-image img-thumbnail doc-image"/>
    //                             </div>
    //
    //                         </div>
    //
    //                         <div className="doc-right">
    //                             <h3 className="doc-title">{doc.title}</h3>
    //
    //                             <div className="doc-meta">
    //
    //                                 <div className="doc-meta-overview">
    //                                     <div className="doc-progress">
    //                                         <progress max="100" value="10"/>
    //                                     </div>
    //                                 </div>
    //
    //                                 <div className="doc-meta-actions">
    //                                     <div className="doc-actions">
    //                                         <a className="fa fa-check"/>
    //                                         {/*<a className="fa fa-share-alt"/>*/}
    //                                     </div>
    //                                 </div>
    //
    //                             </div>
    //
    //                             {/*<div className="doc-footer">*/}
    //
    //                                 {/*<div className="doc-left">*/}
    //
    //                                     {/*<div className="doc-progress">*/}
    //                                         {/*<progress max="100" value="10"/>*/}
    //                                     {/*</div>*/}
    //
    //                                 {/*</div>*/}
    //
    //                                 {/*<div className="doc-right">*/}
    //                                     {/*<div className="doc-actions">*/}
    //                                         {/*<a className="fa fa-check"/>*/}
    //                                         {/*/!*<a className="fa fa-share-alt"/>*!/*/}
    //                                     {/*</div>*/}
    //                                 {/*</div>*/}
    //
    //                             {/*</div>*/}
    //
    //                         </div>
    //
    //                    </div>
    //
    //                 )}
    //
    //             </div>
    //
    //         </div>
    //
    //
    //     );
    // }

    render() {
        const { data } = this.state;
        return (
            <div>
                <ReactTable
                    data={data}
                    columns={[{
                        Header: 'Name',
                        columns: [{
                            Header: 'First Name',
                            accessor: 'firstName'
                        }, {
                            Header: 'Last Name',
                            id: 'lastName',
                            accessor: (d: any) => d.lastName
                        }]
                    }, {
                        Header: 'Info',
                        columns: [{
                            Header: 'Profile Progress',
                            accessor: 'progress',
                            Cell: (row: any) => (
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: '#dadada',
                                        borderRadius: '2px'
                                    }}
                                >
                                    <div
                                        style={{
                                            width: `${row.value}%`,
                                            height: '100%',
                                            backgroundColor: row.value > 66 ? '#85cc00'
                                                : row.value > 33 ? '#ffbf00'
                                                    : '#ff2e00',
                                            borderRadius: '2px',
                                            transition: 'all .2s ease-out'
                                        }}
                                    />
                                </div>
                            )
                        }, {
                            Header: 'Status',
                            accessor: 'status',
                            Cell: (row: any) => (
                                <span>
            <span style={{
                color: row.value === 'relationship' ? '#ff2e00'
                    : row.value === 'complicated' ? '#ffbf00'
                        : '#57d500',
                transition: 'all .3s ease'
            }}>
              &#x25cf;
            </span> {
                                    row.value === 'relationship' ? 'In a relationship'
                                        : row.value === 'complicated' ? `It's complicated`
                                        : 'Single'
                                }
          </span>
                            )
                        }]
                    }]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                />
                <br />
                <Tips />
                <Logo />
            </div>
        );
    }
}
//
//   private addItems() {
//
//         setTimeout(() => {
//
//             this.state.docs.push({
//                  fingerprint: "10101",
//                  title: 'asdf'
//              });
//
//
//             this.setState(this.state);
//
//             this.addItems();
//
//         }, 1000)
//
//     }
//
//
// }

export default App;

/**
 * High level document representation extracted from DocInfo and DocMeta in the
 * repository but simpler for the UI.
 */
export interface IDoc {

    id: string,

    /**
     * The title of this document.
     */
    title: string;

    /**
     * The link back to the original document, when available.
     */
    link?: string;

    source?: ISource;

}

/**
 * The source of a document.  Specifically the title and link.
 */
export interface ISource {
    title: string;
    link: string;
}
