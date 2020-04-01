import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {PDFDocument} from "./PDFDocument";
import {PersistenceLayerManager} from "../../../web/js/datastore/PersistenceLayerManager";
import {AppInitializer} from "../../../web/js/apps/repository/AppInitializer";
import {ASYNC_NULL_FUNCTION} from "polar-shared/src/util/Functions";

let iter: number = 0;

const ViewerContainer = () => {

    ++iter;

    return (

        <main id="viewerContainer"
              itemProp="mainContentOfPage"
              style={{
                  position: 'absolute',
                  overflow: 'auto',
                  top: 0,
                  left: 0,
                  height: '100%'
              }}
              data-iter={iter}>

            <div>
                <div id="viewer" className="pdfViewer">
                    <div/>

                </div>
            </div>

        </main>
    );

};

export class PDFApp {

    constructor(private readonly persistenceLayerManager = new PersistenceLayerManager()) {
    }

    public async start() {

        const persistenceLayerManager = this.persistenceLayerManager;

        const app = await AppInitializer.init({
            persistenceLayerManager,
            onNeedsAuthentication: ASYNC_NULL_FUNCTION
        });

        const rootElement = document.getElementById('root') as HTMLElement;

        // FIXME: full screen mode without a navbar...
        // FIXME: sidebar that can be toggled on and off with the pdf width
        // adjusted
        // FIXME: annotation bar working
        // FIXME: load the docMeta to determine what doc to load and listen
        // for changes
        // FIXME: the sidebar / annotation bar needs to work.
        // FIXME: dark mode for the PDF (needs changes to pdfjs)
        // FIXME: verify that it works on mobile...

        ReactDOM.render((
            <div style={{}}>
                {/*<ViewerContainer/>*/}
                <PDFDocument target="viewerContainer" url="./test.pdf"/>
            </div>
            ), rootElement);

        // ReactDOM.render((
        //     // <div>
        //     //     <Viewer/>
        //     // </div>
        //     ), rootElement);

    }

}
