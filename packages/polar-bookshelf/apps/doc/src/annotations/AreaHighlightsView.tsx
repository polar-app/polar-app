import * as React from "react";
import {PageAnnotations} from "./PageAnnotations";
import {AreaHighlightRenderer} from "./AreaHighlightRenderer";
import {useDocViewerStore} from "../DocViewerStore";
import {useAnnotationContainers} from "./AnnotationHooks";
import {AnnotationContainers} from "./AnnotationContainers";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {useHighlightBlockIDs} from "../../../../web/js/notes/HighlightBlocksHooks";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {observer} from "mobx-react-lite";
import {useBlocksStore} from "../../../../web/js/notes/store/BlocksStore";
import {BlockPredicates} from "../../../../web/js/notes/store/BlockPredicates";

interface IAreaHighlightsViewRenderer {
    docMeta: IDocMeta;
}

export const BlockAreaHighlightsViewRenderer: React.FC<IAreaHighlightsViewRenderer> = ({ docMeta }) => {

    const highlightIDs = useHighlightBlockIDs({
        docID: docMeta.docInfo.fingerprint,
        type: AnnotationContentType.AREA_HIGHLIGHT
    });

    return (
        <>
            {highlightIDs.map(id => (
                <BlockAreaHighlightRenderer key={id} id={id} />)
            )}
        </>
    );
};

interface IBlockAreaHighlightRendererProps {
    id: BlockIDStr;
}

export const BlockAreaHighlightRenderer: React.FC<IBlockAreaHighlightRendererProps> = observer((props) => {
    const { id } = props;

    const annotationContainers = useAnnotationContainers();
    const blocksStore = useBlocksStore();
    const block = blocksStore.getBlock(id);

    const pageHighlight = React.useMemo(() => {
        if (! block || ! BlockPredicates.isAnnotationAreaHighlightBlock(block)) {
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
        <AreaHighlightRenderer id={pageAnnotation.annotation.id}
                               container={pageAnnotation.container}
                               pageNum={pageAnnotation.pageNum}
                               fingerprint={pageAnnotation.fingerprint}
                               areaHighlight={pageAnnotation.annotation} />
    );
});


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

    if (! docMeta) {
        return null;
    }

    return <BlockAreaHighlightsViewRenderer docMeta={docMeta} />
});
