import {useLocation} from "react-router-dom";
import {useDocViewerCallbacks} from "./DocViewerStore";
import {AnnotationLinks} from "../../../web/js/annotation_sidebar/AnnotationLinks";
import {ILocation} from "../../../web/js/react/router/ReactRouters";
import React from 'react';

export type DocViewerJumpCause = 'init' | 'history';

export function useDocViewerJumpToPageLoader(): (location: ILocation, cause: DocViewerJumpCause) => boolean {

    const {onPageJump} = useDocViewerCallbacks();
    const prevLocationRef = React.useRef<ILocation | undefined>();

    return (location, cause) => {

        try {

            if (prevLocationRef.current?.hash === location.hash) {
                return false;
            }

            const annotationLink = AnnotationLinks.parse(location.hash);

            if (annotationLink?.page) {
                console.log(`Jumping to page ${annotationLink.page} due to '${cause}'`);
                onPageJump(annotationLink.page);
                return true;
            }

            return false;

        } finally {
            prevLocationRef.current = location;
        }

    }

}


export function useDocViewerPageJumpListener() {
    const location = useLocation();
    const docViewerJumpToPageLoader = useDocViewerJumpToPageLoader();
    docViewerJumpToPageLoader(location, 'history');
}
