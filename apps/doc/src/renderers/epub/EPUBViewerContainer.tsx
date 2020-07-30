import React from 'react';
import {useDocViewerStore} from "../../DocViewerStore";

export const EPUBViewerContainer = React.memo(() => {

    const {page} = useDocViewerStore(['page']);

    return (
        <main id="viewerContainer"
              style={{
                  position: 'absolute',
                  overflow: 'auto',
                  top: '0',
                  width: '100%',
                  height: '100%',
                  overflowX: 'hidden',
              }}
              itemProp="mainContentOfPage">

            <div>
                <div id="viewer"
                     className="epubViewer">
                    <div data-page-number={page}
                         data-loaded="true"
                         className="page"
                         style={{
                             userSelect: 'none'
                         }}/>
                </div>
            </div>

        </main>
    );
})
