import * as React from "react";
import {PageAnnotations} from "./PageAnnotations";
import {AreaHighlightRenderer2} from "./AreaHighlightRenderer2";
import {useDocViewerStore} from "../DocViewerStore";
import {useAnnotationContainers} from "./AnnotationHooks";
import {AnnotationContainers} from "./AnnotationContainers";

export const AreaHighlightsView = React.memo(() => {

    const {docMeta} = useDocViewerStore(['docMeta']);
    const annotationContainers = useAnnotationContainers();

    if (!docMeta) {
        return null;
    }

    const pageAnnotations = PageAnnotations.compute(docMeta, pageMeta => Object.values(pageMeta.areaHighlights || {}));
    const visiblePageAnnotations = AnnotationContainers.visible(annotationContainers, pageAnnotations);

    const rendered = visiblePageAnnotations.map(current =>
                                             <AreaHighlightRenderer2
                                                 key={current.annotation.id}
                                                 container={current.container}
                                                 pageNum={current.pageNum}
                                                 fingerprint={docMeta?.docInfo.fingerprint}
                                                 areaHighlight={current.annotation}/>);

    return (
        <>
            {rendered}
        </>
    );

});

