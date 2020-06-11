import * as React from "react";
import {useContextMenu} from "../../../../repository/js/doc_repo/MUIContextMenu";
import {Elements} from "../../../../../web/js/util/Elements";

let iter: number = 0;

export const PDFViewerContainer = () => {

    ++iter;

    const contextMenu = useContextMenu();

    const onContextMenu = React.useCallback((event: React.MouseEvent<HTMLElement>) => {

        const pageElement = Elements.untilRoot(event.target as HTMLElement, ".page");

        if (! pageElement) {
            console.warn("Not found within .page element");
            return;
        }

        contextMenu.onContextMenu(event);

    }, []);

    return (

        <main onContextMenu={onContextMenu}
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
