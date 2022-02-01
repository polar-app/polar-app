import * as React from "react";
import {TextHighlightRenderer} from "./TextHighlightRenderer";
import {useDocViewerStore} from "../DocViewerStore";
import {AnnotationContainers} from "./AnnotationContainers";
import {useAnnotationContainers} from "./AnnotationHooks";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {useHighlightBlockIDs} from "../../../../web/js/notes/HighlightBlocksHooks";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {PageAnnotations} from "./PageAnnotations";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {observer} from "mobx-react-lite";
import {useBlocksStore} from "../../../../web/js/notes/store/BlocksStore";
import {BlockPredicates} from "../../../../web/js/notes/store/BlockPredicates";

interface ITextHighlightsViewRendererProps {
    docMeta: IDocMeta;
}

export const BlockTextHighlightsViewRenderer: React.FC<ITextHighlightsViewRendererProps> = ({ docMeta }) => {

    const highlightIDs = useHighlightBlockIDs({
        docID: docMeta.docInfo.fingerprint,
        type: AnnotationContentType.TEXT_HIGHLIGHT,
    });

    return (
        <>
            {highlightIDs.map(id => (
                <BlockTextHighlightRenderer key={id} id={id} />)
            )}
        </>
    );
};

interface IBlockTextHighlightRendererProps {
    id: BlockIDStr;
}

export const BlockTextHighlightRenderer: React.FC<IBlockTextHighlightRendererProps> = observer((props) => {
    const { id } = props;
    const annotationContainers = useAnnotationContainers();
    const blocksStore = useBlocksStore();
    const block = blocksStore.getBlock(id);

    const pageHighlight = React.useMemo(() => {
        if (! block || ! BlockPredicates.isAnnotationTextHighlightBlock(block)) {
            return null;
        }

        const { value, pageNum, docID } = block.content.toJSON();

        return {
            annotation: { ...value, id },
            fingerprint: docID,
            pageNum,
        };
    }, [block, id]);

    if (! pageHighlight) {
        return null;
    }

    const pageAnnotation = AnnotationContainers.visibleAnnotation(annotationContainers, pageHighlight);

    if (! pageAnnotation) {
        return null;
    }

    return (
        <TextHighlightRenderer type="block"
                               id={pageAnnotation.annotation.id}
                               container={pageAnnotation.container}
                               pageNum={pageAnnotation.pageNum}
                               fingerprint={pageAnnotation.fingerprint}
                               pageAnnotation={pageAnnotation} />
    );
});


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

    if (! docMeta) {
        return null;
    }

    return <BlockTextHighlightsViewRenderer docMeta={docMeta} />
});
