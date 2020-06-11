import React from 'react';
import Divider from "@material-ui/core/Divider";

export const EPUBViewerContainer = React.memo(() => {

    return (
        <>
            {/*<Divider/>*/}
            <main id="viewerContainer"
                  style={{
                      position: 'absolute',
                      overflow: 'auto',
                      top: '0',
                      width: '100%',
                      height: '100%',
                  }}
                  itemProp="mainContentOfPage">

                <div>
                    <div id="viewer" className="epubViewer">
                        <div className="page"/>
                    </div>
                </div>

            </main>
        </>
    );
})
