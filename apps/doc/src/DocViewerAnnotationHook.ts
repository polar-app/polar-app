import {useHistory} from "react-router-dom";
import {useDocViewerCallbacks} from "./DocViewerStore";
import {AnnotationLinks} from "../../../web/js/annotation_sidebar/AnnotationLinks";
import {useComponentDidMount} from "../../../web/js/hooks/lifecycle";

export interface ILocation {
    readonly hash: string;
}

interface ILoaded {
    readonly page: boolean;
    readonly annotation: boolean;
}

export type DocViewerJumpCause = 'init' | 'history';

export function useDocViewerJumpToPageLoader(): (location: ILocation, cause: DocViewerJumpCause) => boolean {

    const {onPageJump} = useDocViewerCallbacks();

    return (location, cause) => {

        const annotationLink = AnnotationLinks.parse(location.hash);

        if (annotationLink.page) {
            console.log(`Jumping to page ${annotationLink.page} cause was ${cause}`);
            onPageJump(annotationLink.page);
            return true;
        }

        return false;

    }

}

export function useDocViewerJumpToAnnotationLoader(): (location: ILocation) => boolean {

    return (location: ILocation) => {

        const annotationLink = AnnotationLinks.parse(location.hash);

        if (annotationLink.annotation) {

            console.log("Jumping to annotation: " + annotationLink.annotation);

            const annotationElement = document.getElementById(annotationLink.annotation);

            if (annotationElement) {
                annotationElement.scrollIntoView();
                return true;
            } else {
                console.warn("Count not find annotation element to scroll")
            }

        }

        return false;

    }

}

export type DocViewerAnnotationLoader = (location: ILocation) => ILoaded | undefined;

export function useDocViewerJumpLoader(cause: DocViewerJumpCause): DocViewerAnnotationLoader {

    const pageLoader = useDocViewerJumpToPageLoader();
    const annotationLoader = useDocViewerJumpToAnnotationLoader();

    return (location: ILocation) => {
        const page = pageLoader(location, cause);
        const annotation = annotationLoader(location);
        return {page, annotation};
    }
}

/**
 * Hooks so that the annotation viewer can jump to pages or annotations based
 * on URL.
 */
export function useDocViewerJumpListener() {

    const history = useHistory();
    const docViewerAnnotationLoader = useDocViewerJumpLoader('history');

    useComponentDidMount(() => {

        history.listen((location) => {
            docViewerAnnotationLoader(location);
        });

    });

}
