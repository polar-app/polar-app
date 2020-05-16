import * as React from "react";
import {useContextMenu} from "../../../web/spectron0/material-ui/doc_repo_table/MUIContextMenu";

let iter: number = 0;

export const ViewerContainer = () => {

    ++iter;

    const contextMenu = useContextMenu();

    return (

        <main {...contextMenu}
              id="viewerContainer"
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
