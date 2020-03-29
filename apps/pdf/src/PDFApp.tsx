import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {PDFDocument} from "./PDFDocument";

let iter: number = 0;

const ViewerContainer = () => {

    ++iter;

    return (

        <main id="viewerContainer" itemProp="mainContentOfPage" data-iter={iter}>

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
            <div>
                <ViewerContainer/>
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
