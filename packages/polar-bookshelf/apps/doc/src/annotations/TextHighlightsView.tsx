import * as React from "react";
import {TextHighlightRenderer} from "./TextHighlightRenderer";
import {useDocViewerStore} from "../DocViewerStore";
import {AnnotationContainers} from "./AnnotationContainers";
import {useAnnotationContainers} from "./AnnotationHooks";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {useHighlightBlocks} from "../../../../web/js/notes/HighlightBlocksHooks";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {PageAnnotations} from "./PageAnnotations";
import {useNotesIntegrationEnabled} from "../../../../web/js/apps/repository/MigrationToBlockAnnotations";

interface ITextHighlightsViewRendererProps {
    docMeta: IDocMeta;
}

export const BlockTextHighlightsViewRenderer: React.FC<ITextHighlightsViewRendererProps> = ({ docMeta }) => {

    const annotationContainers = useAnnotationContainers();
    const highlights = useHighlightBlocks({
        docID: docMeta.docInfo.fingerprint,
        type: AnnotationContentType.TEXT_HIGHLIGHT,
    });
    
    const pageHighlights = React.useMemo(() =>
        highlights.map(({ content, id }) => {
            const { value, pageNum, docID } = content.toJSON();
            return {
                annotation: { ...value, id },
                fingerprint: docID,
                pageNum,
            };
        })
    , [highlights]);

    const visiblePageAnnotations = AnnotationContainers.visible(annotationContainers, pageHighlights);

    const rendered = visiblePageAnnotations.map(current =>
                                             <TextHighlightRenderer
                                                 type="block"
                                                 id={current.annotation.id}
                                                 key={current.annotation.id}
                                                 container={current.container}
                                                 pageNum={current.pageNum}
                                                 fingerprint={docMeta?.docInfo.fingerprint}
                                                 pageAnnotation={current}/>);

    return <>{rendered}</>;
};


export const DocMetaTextHighlightsView: React.FC<ITextHighlightsViewRendererProps> = ({ docMeta }) => {

    const annotationContainers = useAnnotationContainers();

    if (!docMeta) {
        return null;
    }

    const pageAnnotations = PageAnnotations.compute(docMeta, pageMeta => Object.values(pageMeta.textHighlights || {}));

    const visiblePageAnnotations = AnnotationContainers.visible(annotationContainers, pageAnnotations);

    const rendered = visiblePageAnnotations.map(current =>
                                             <TextHighlightRenderer
                                                 type="docMeta"
                                                 id={current.annotation.id}
                                                 key={current.annotation.id}
                                                 container={current.container}
                                                 pageNum={current.pageNum}
                                                 fingerprint={docMeta?.docInfo.fingerprint}
                                                 pageAnnotation={current}/>);

    return <>{rendered}</>;
};


export const TextHighlightsView = React.memo(() => {
    const {docMeta} = useDocViewerStore(['docMeta']);
    const notesIntegrationEnabled = useNotesIntegrationEnabled();

    if (! docMeta) {
        return null;
    }

    if (notesIntegrationEnabled) {
        return <BlockTextHighlightsViewRenderer docMeta={docMeta} />
    }

    return <DocMetaTextHighlightsView docMeta={docMeta} />;
});
