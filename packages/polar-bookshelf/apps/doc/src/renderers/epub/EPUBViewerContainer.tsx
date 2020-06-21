import React from 'react';
import Paper from '@material-ui/core/Paper';

export const EPUBViewerContainer = React.memo(() => {

    return (
        <Paper className="m-2">
            {/*<Divider/>*/}
            <main id="viewerContainer"
                  style={{
                  }}
                  itemProp="mainContentOfPage">

                <div>
                    <div id="viewer" className="epubViewer">
                        <div className="page"/>
                    </div>
                </div>

            </main>
        </Paper>
    );
})
