import {useLocation} from "react-router-dom";
import {useDocViewerCallbacks} from "./DocViewerStore";
import {AnnotationLinks} from "../../../web/js/annotation_sidebar/AnnotationLinks";
import {ILocation} from "../../../web/js/react/router/ReactRouters";
import {useRefTracker} from "../../dev2/App";
import React from 'react';

interface ILoaded {
    readonly page: boolean;
    readonly annotation: boolean;
}

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
//
// export function useDocViewerJumpToAnnotationLoader(): (location: ILocation) => boolean {
//
//     return (location: ILocation) => {
//
//         const annotationLink = AnnotationLinks.parse(location.hash);
//
//         if (annotationLink.annotation) {
//
//             console.log("Jumping to annotation: " + annotationLink.annotation);
//
//             const annotationElement = document.getElementById(annotationLink.annotation);
//
//             if (annotationElement) {
//                 annotationElement.scrollIntoView();
//                 return true;
//             } else {
//                 console.warn("Count not find annotation element to scroll")
//             }
//
//         }
//
//         return false;
//
//     }
//
// }

export type DocViewerAnnotationLoader = (location: ILocation) => ILoaded | undefined;

// export function useDocViewerJumpLoader(cause: DocViewerJumpCause): DocViewerAnnotationLoader {
//
//     const pageLoader = useDocViewerJumpToPageLoader();
//     const annotationLoader = useDocViewerJumpToAnnotationLoader();
//
//     return (location: ILocation) => {
//         const page = pageLoader(location, cause);
//         const annotation = annotationLoader(location);
//         return {page, annotation};
//     }
// }

// /**
//  * Hooks so that the annotation viewer can jump to pages or annotations based
//  * on URL.
//  */
// export function useDocViewerJumpListener() {
//
//     const history = useHistory();
//     const docViewerAnnotationLoader = useDocViewerJumpLoader('history');
//
//     useComponentDidMount(() => {
//
//         history.listen((location) => {
//             docViewerAnnotationLoader(location);
//         });
//
//     });
//
// }

export function useDocViewerPageJumpListener() {
    const location = useLocation();
    const docViewerJumpToPageLoader = useDocViewerJumpToPageLoader();
    docViewerJumpToPageLoader(location, 'history');
}

export interface IAnnotationWithID {
    readonly id: string;
}
//
// function createAnnotationPredicate(annotation: IAnnotationWithID) {
//
//     return (location: ILocation): boolean => {
//
//         // TODO: we need some type of context for this otherwise every component is
//         // going to parse this out N times.
//         const annotationLink = AnnotationLinks.parse(location.hash);
//
//         return annotationLink?.target === annotation.id;
//
//     }
//
// }
//
//
// interface IAnnotationProps {
//     readonly annotation : IAnnotationWithID;
// }

//
// /**
//  * Take a component that takes a ref, then listen for when it's highlighted
//  * so that we can scrollIntoView once it's selected.
//  */
// export function withDocViewerJumpListener<P extends IAnnotationProps>(component: ScrollIntoViewWrappedComponent<P>) {
//     return withScrollIntoView(component, (props: P) => createAnnotationPredicate(props.annotation));
// }

// /**
//  * Create a wrapper component by just giving it a predicate to see if the
//  * location is navigated to and then scroll the component.
//  */
// export function useDocViewerScrollAnnotationIntoView<P>(annotation: IAnnotationWithID) {
//
//     // FIXME: this one is deprecated and won't be used I think.
//
//     const location = useLocation();
//     const predicate = createAnnotationPredicate(annotation);
//     const docViewerElementsContext = useDocViewerElementsContext();
//
//     if (predicate(location)) {
//
//         const docViewerElement = docViewerElementsContext.getDocViewerElement();
//         const selector = '#annotation-' + annotation.id;
//
//         const annotationElement = docViewerElement.querySelector(selector);
//
//         // FIXME: this sucks and it's taking too long to build this out...
//         // just for simple annotation jumping due to iframes.
//
//         if (annotationElement) {
//             annotationElement.scrollIntoView();
//         } else {
//             console.warn("No annotation element for selector: " + selector);
//         }
//
//     }
//
// }
