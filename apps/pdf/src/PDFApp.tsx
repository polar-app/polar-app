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

            // FIXME: how do I do the init of the repoDocMetaLoader here.. same
            //  thing for the loader

            onNeedsAuthentication: ASYNC_NULL_FUNCTION

        });

        const rootElement = document.getElementById('root') as HTMLElement;

        ReactDOM.render((
            <div style={{
                 }}>
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
