import * as React from "react";
import {PageAnnotation, PageAnnotations} from "./PageAnnotations";
import {AreaHighlightRenderer} from "./AreaHighlightRenderer";
import {useDocViewerStore} from "../DocViewerStore";
import {useAnnotationContainers} from "./AnnotationHooks";
import {AnnotationContainers} from "./AnnotationContainers";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {useHighlightBlocks} from "../../../../web/js/notes/HighlightNotesUtils";
import {NEW_NOTES_ANNOTATION_BAR_ENABLED} from "../DocViewer";

interface IAreaHighlightsViewRenderer {
    docMeta: IDocMeta;
}

export const BlockAreaHighlightsViewRenderer: React.FC<IAreaHighlightsViewRenderer> = ({ docMeta }) => {
    const annotationContainers = useAnnotationContainers();
    const highlights = useHighlightBlocks({
        docID: docMeta.docInfo.fingerprint,
        type: AnnotationContentType.AREA_HIGHLIGHT
    });
    
    const pageHighlights: ReadonlyArray<PageAnnotation<IAreaHighlight>> = React.useMemo(() =>
        highlights.map(({ content }) => {
            const { value, pageNum, docID } = content.toJSON();
            return {
                annotation: value,
                fingerprint: docID,
                pageNum,
            };
        })
    , [highlights]);

    const visiblePageAnnotations = AnnotationContainers.visible(annotationContainers, pageHighlights);

    const rendered = visiblePageAnnotations.map(current =>
                                             <AreaHighlightRenderer
                                                 key={current.annotation.id}
                                                 container={current.container}
                                                 pageNum={current.pageNum}
                                                 fingerprint={docMeta.docInfo.fingerprint}
                                                 areaHighlight={current.annotation}/>);
    return <>{rendered}</>;
};



export const DocMetaAreaHighlightsView = () => {

    const {docMeta} = useDocViewerStore(['docMeta']);
    const annotationContainers = useAnnotationContainers();

    if (!docMeta) {
        return null;
    }

    const pageAnnotations = PageAnnotations.compute(docMeta, pageMeta => Object.values(pageMeta.areaHighlights || {}));
    const visiblePageAnnotations = AnnotationContainers.visible(annotationContainers, pageAnnotations);

    const rendered = visiblePageAnnotations.map(current =>
                                             <AreaHighlightRenderer
                                                 key={current.annotation.id}
                                                 container={current.container}
                                                 pageNum={current.pageNum}
                                                 fingerprint={docMeta?.docInfo.fingerprint}
                                                 areaHighlight={current.annotation}/>);

    return <>{rendered}</>;

};

export const AreaHighlightsView = React.memo(function AreaHighlightsView() {

    const {docMeta} = useDocViewerStore(['docMeta']);

    if (! docMeta) {
        return null;
    }

    if (NEW_NOTES_ANNOTATION_BAR_ENABLED) {
        return <BlockAreaHighlightsViewRenderer docMeta={docMeta} />
    }

    return <DocMetaAreaHighlightsView />
});
