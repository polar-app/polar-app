import React from 'react';

export const EPUBViewerContainer = React.memo(() => {

    return (

        <main id="viewerContainer"
              style={{
                  position: 'absolute',
                  overflow: 'auto',
                  top: '0',
                  width: '100%',
                  height: '100%'
              }}
              itemProp="mainContentOfPage">

            <div>
                <div id="viewer" className="epubViewer">
                    <div className="page"/>
                </div>
            </div>

        </main>
    );
})
