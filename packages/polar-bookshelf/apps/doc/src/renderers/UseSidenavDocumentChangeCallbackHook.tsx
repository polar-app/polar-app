import {useLocation} from "react-router-dom";
import React from "react";
import {DocViewerAppURLs} from "../DocViewerAppURLs";
import {useStateRef} from "../../../../web/js/hooks/ReactHooks";

/**
 * Listen to route changes so that if the document changes we can resize.  This
 * is a super efficient function so if we call it too many times it doesn't
 * really matter.
 */
export function useSidenavDocumentChangeCallback(callback: () => void) {

    const location = useLocation();

    const currentDocID = React.useRef(DocViewerAppURLs.parse(document.location.href)?.id);

    React.useEffect(() => {

        const newDocViewerURL = DocViewerAppURLs.parse(document.location.href);

        if (newDocViewerURL?.id && newDocViewerURL?.id !== currentDocID.current) {
            callback();
        }

        currentDocID.current = newDocViewerURL?.id;

    }, [callback, location]);

}

export function useDocumentViewerVisible(docID: string): boolean {
    const location = useLocation();

    const [visible, setVisible, visibleRef] = useStateRef<boolean>(false)

    React.useEffect(() => {

        const newDocViewerURL = DocViewerAppURLs.parse(location.pathname);

        if (newDocViewerURL?.id && newDocViewerURL.id === docID) {
            if (!visibleRef.current) {
                setVisible(true);
            }
        } else {
            if (visibleRef.current) {
                setVisible(false);
            }
        }
    }, [location, docID, visibleRef, setVisible]);

    return visible;
}

export function useDocumentViewerVisibleElemFocus(docID: string, elem: HTMLElement | undefined): void {
    const isViewerVisible = useDocumentViewerVisible(docID);

    React.useEffect(() => {
        if (isViewerVisible) {
            elem?.focus();
        }
    }, [isViewerVisible, elem]);
}
