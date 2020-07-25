import * as React from "react";
import {PageAnnotations} from "./PageAnnotations";
import {PagemarkRenderer2} from "./PagemarkRenderer2";
import {useDocViewerStore} from "../DocViewerStore";
import {useAnnotationContainers} from "./AnnotationHooks";
import {AnnotationContainers} from "./AnnotationContainers";

export const PagemarksView = React.memo(() => {

    const {docMeta} = useDocViewerStore(['docMeta']);
    const annotationContainers = useAnnotationContainers();

    if (!docMeta) {
        return null;
    }

    const pageAnnotations = PageAnnotations.compute(docMeta, pageMeta => Object.values(pageMeta.pagemarks || {}));
    const visiblePageAnnotations = AnnotationContainers.visible(annotationContainers, pageAnnotations);

    const renderers = visiblePageAnnotations.map(current =>
                                              <PagemarkRenderer2
                                                  key={current.annotation.id}
                                                  pageNum={current.pageNum}
                                                  container={current.container}
                                                  fingerprint={docMeta?.docInfo.fingerprint}
                                                  pagemark={current.annotation}/>);

    return (
        <>
            {renderers}
        </>
    )

});

