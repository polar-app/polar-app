import * as React from "react";
import {PageAnnotations} from "./PageAnnotations";
import {TextHighlightRenderer2} from "./TextHighlightRenderer2";
import isEqual from "react-fast-compare";
import {useDocViewerStore} from "../DocViewerStore";
import {AnnotationContainers} from "./AnnotationContainers";
import {useAnnotationContainers} from "./AnnotationHooks";

export const TextHighlightsView = React.memo(() => {

    const {docMeta} = useDocViewerStore(['docMeta']);
    const annotationContainers = useAnnotationContainers();

    if (!docMeta) {
        return null;
    }

    const pageAnnotations = PageAnnotations.compute(docMeta, pageMeta => Object.values(pageMeta.textHighlights || {}));
    const visiblePageAnnotations = AnnotationContainers.visible(annotationContainers, pageAnnotations);

    const rendered = visiblePageAnnotations.map(current =>
                                             <TextHighlightRenderer2
                                                 key={current.annotation.id}
                                                 container={current.container}
                                                 pageNum={current.pageNum}
                                                 fingerprint={docMeta?.docInfo.fingerprint}
                                                 textHighlight={current.annotation}/>);

    return (
        <>
            {rendered}
        </>
    );

}, isEqual);

