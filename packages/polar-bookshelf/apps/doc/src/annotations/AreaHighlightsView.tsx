import * as React from "react";
import {PageAnnotations} from "./PageAnnotations";
import {AreaHighlightRenderer} from "./AreaHighlightRenderer";
import {useDocViewerStore} from "../DocViewerStore";
import {useAnnotationContainers} from "./AnnotationHooks";
import {AnnotationContainers} from "./AnnotationContainers";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {useHighlightBlocks} from "../../../../web/js/notes/HighlightBlocksHooks";
import {useNotesIntegrationEnabled} from "../../../../web/js/notes/NoteUtils";

interface IAreaHighlightsViewRenderer {
    docMeta: IDocMeta;
}

export const BlockAreaHighlightsViewRenderer: React.FC<IAreaHighlightsViewRenderer> = ({ docMeta }) => {
    const annotationContainers = useAnnotationContainers();
    const highlights = useHighlightBlocks({
        docID: docMeta.docInfo.fingerprint,
        type: AnnotationContentType.AREA_HIGHLIGHT
    });
    
    const pageHighlights = React.useMemo(() =>
        highlights.map(({ content, id }) => {
            const { value, pageNum, docID } = content.toJSON();
            return {
                annotation: {
                    id,
                    ...value,
                },
                fingerprint: docID,
                pageNum,
            };
        })
    , [highlights]);

    const visiblePageAnnotations = AnnotationContainers.visible(annotationContainers, pageHighlights);

    const rendered = visiblePageAnnotations.map(current =>
                                             <AreaHighlightRenderer
                                                 key={current.annotation.id}
                                                 id={current.annotation.id}
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
                                                 id={current.annotation.id}
                                                 container={current.container}
                                                 pageNum={current.pageNum}
                                                 fingerprint={docMeta?.docInfo.fingerprint}
                                                 areaHighlight={current.annotation}/>);

    return <>{rendered}</>;

};

export const AreaHighlightsView = React.memo(function AreaHighlightsView() {

    const {docMeta} = useDocViewerStore(['docMeta']);
    const notesIntegrationEnabled = useNotesIntegrationEnabled();

    if (! docMeta) {
        return null;
    }

    if (notesIntegrationEnabled) {
        return <BlockAreaHighlightsViewRenderer docMeta={docMeta} />
    }

    return <DocMetaAreaHighlightsView />
});
