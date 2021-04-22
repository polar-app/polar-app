import * as React from "react";
import {PageAnnotations} from "./PageAnnotations";
import {TextHighlightRenderer} from "./TextHighlightRenderer";
import {useDocViewerStore} from "../DocViewerStore";
import {AnnotationContainers} from "./AnnotationContainers";
import {useAnnotationContainers} from "./AnnotationHooks";
import {memoForwardRef} from "../../../../web/js/react/ReactUtils";

export const TextHighlightsView = memoForwardRef(() => {

    const {docMeta} = useDocViewerStore(['docMeta']);

    const annotationContainers = useAnnotationContainers();

    if (!docMeta) {
        return null;
    }

    const pageAnnotations = PageAnnotations.compute(docMeta, pageMeta => Object.values(pageMeta.textHighlights || {}));

    const visiblePageAnnotations = AnnotationContainers.visible(annotationContainers, pageAnnotations);

    const rendered = visiblePageAnnotations.map(current =>
                                             <TextHighlightRenderer
                                                 key={current.annotation.id}
                                                 container={current.container}
                                                 pageNum={current.pageNum}
                                                 fingerprint={docMeta?.docInfo.fingerprint}
                                                 pageAnnotation={current}/>);

    return (
        <>
            {rendered}
        </>
    );

});

