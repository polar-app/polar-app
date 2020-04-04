import * as React from "react";

let iter: number = 0;

export const ViewerContainer = () => {

    ++iter;

    return (

        <main id="viewerContainer"
              itemProp="mainContentOfPage"
              data-iter={iter}>

            <div>
                <div id="viewer" className="pdfViewer">
                    <div/>

                </div>
            </div>

        </main>
    );

};
