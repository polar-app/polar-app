import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {PDFDocument} from "./PDFDocument";

export class PDFApp {

    public start() {

        const rootElement = document.getElementById('root') as HTMLElement;

        ReactDOM.render((
            <div>
                <main id="viewerContainer" itemProp="mainContentOfPage">

                    <div>
                        <div id="viewer" className="pdfViewer">
                            <div/>

                        </div>
                    </div>

                </main>
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
