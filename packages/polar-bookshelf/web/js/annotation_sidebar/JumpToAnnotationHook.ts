import {useHistory} from "react-router-dom";
import {IDocAnnotationRef} from "./DocAnnotation";
import {DocViewerAppURLs} from "../../../apps/doc/src/DocViewerAppURLs";
import {useDocURLLoader} from "../apps/main/doc_loaders/browser/DocURLLoader";
import {AnnotationLinks} from "./AnnotationLinks";

/**
 * This is the default jump to annotation button that's used in the document
 * repository
 */
export function useJumpToAnnotationHandler() {

    const history = useHistory();
    const docURLLoader = useDocURLLoader();

    function isDocViewer() {
        return DocViewerAppURLs.parse(document.location.href) !== undefined;
    }

    return (annotation: IDocAnnotationRef) => {

        if (isDocViewer()) {
            const hash = AnnotationLinks.createHash(annotation);
            history.push({hash});
        } else {
            const url = AnnotationLinks.createURL(annotation);
            docURLLoader(url);
        }

    }

}
