import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {PDFDocument} from "./PDFDocument";

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

    public start() {

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
