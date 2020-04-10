import * as React from "react";

let iter: number = 0;

export const ViewerContainer = () => {

    ++iter;

    return (

        <main id="viewerContainer"
              style={{
                  position: 'absolute',
                  overflow: 'auto',
                  top: '0',
                  width: '100%',
                  height: '100%'
              }}
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
