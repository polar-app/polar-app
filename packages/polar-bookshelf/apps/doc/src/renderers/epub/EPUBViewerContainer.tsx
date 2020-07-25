import React from 'react';
import Paper from '@material-ui/core/Paper';

export const EPUBViewerContainer = React.memo(() => {

    return (
        // <Paper className="m-2">
        //     {/*<Divider/>*/}
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
                        <div className="page"
                             style={{
                                 userSelect: 'none'
                             }}/>
                    </div>
                </div>

            </main>
        // </Paper>
    );
})
