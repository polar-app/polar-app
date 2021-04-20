import * as React from "react";
import {useContextMenu} from "../../../../repository/js/doc_repo/MUIContextMenu";
import {Elements} from "../../../../../web/js/util/Elements";
import {GlobalPDFCss} from "./GlobalPDFCss";
import {useDocViewerCallbacks, useDocViewerStore} from "../../DocViewerStore";
import {FakePinchToZoom} from "../../PinchHooks";

let iter: number = 0;

interface IProps {
    readonly children: React.ReactNode;
}

export const PDFViewerContainer = React.memo(function PDFViewerContainer(props: IProps) {

    const contextMenu = useContextMenu();

    const onContextMenu = React.useCallback((event: React.MouseEvent<HTMLElement>) => {

        const pageElement = Elements.untilRoot(event.target as HTMLElement, ".page");

        if (! pageElement) {
            console.warn("Not found within .page element");
            return;
        }

        contextMenu.onContextMenu(event);

    }, [contextMenu]);

    const viewerRef = React.useRef<HTMLDivElement>(null);
    
    const {docScale} = useDocViewerStore(['docScale']);
    const {setScale} = useDocViewerCallbacks()

    const shouldUpdateScale = React.useCallback((zoom: number): boolean => {
        const min = 0.1, max = 4;
        const scale = docScale!.scaleValue * zoom;
        return scale >= min && scale <= max;
    }, [docScale]);

    const handleZoom = React.useCallback((zoom: number): void => {
        setScale({ label: `${zoom * 100}%`, value: `${zoom * docScale!.scaleValue}` });
    }, [docScale, setScale]);

    ++iter;

    return (
        <>
            {docScale !== undefined && (
                <FakePinchToZoom
                    elemRef={viewerRef}
                    shouldUpdate={shouldUpdateScale}
                    onZoom={handleZoom}
                />
            )}
            <GlobalPDFCss/>
            <div onContextMenu={onContextMenu}
                  id="viewerContainer"
                  style={{
                      position: 'absolute',
                      overflow: 'auto',
                      top: '0',
                      width: '100%',
                      height: '100%',
                  }}
                  tabIndex={0}
                  className="viewerContainer"
                  itemProp= "mainContentOfPage"
                  data-iter={iter}>

                <div>
                    <div id="viewer" className="pdfViewer viewer" ref={viewerRef}>
                        <div/>

                        {props.children}

                    </div>
                </div>

            </div>
        </>
    );

});
