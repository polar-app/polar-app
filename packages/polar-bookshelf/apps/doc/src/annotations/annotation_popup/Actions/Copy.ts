import React from "react";
import {Clipboards} from "../../../../../../web/js/util/system/clipboard/Clipboards";
import {useDocViewerContext} from "../../../renderers/DocRenderer";
import {SelectedContents} from "../../../../../../web/js/highlights/text/selection/SelectedContents";
import {BlockTextHighlights} from "polar-blocks/src/annotations/BlockTextHighlights";
import {useAnnotationBlockManager} from "../../../../../../web/js/notes/HighlightBlocksHooks";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {useAnnotationPopupStore} from "../AnnotationPopupContext";

export const useCopyAnnotation = () => {
    const annotationPopupStore = useAnnotationPopupStore();
    const { fileType } = useDocViewerContext();
    const { getBlock } = useAnnotationBlockManager();

    return React.useCallback(() => {
        const { selectedAnnotationID, selectionEvent } = annotationPopupStore;

        if (selectedAnnotationID) {
            const annotation = getBlock(selectedAnnotationID, AnnotationContentType.TEXT_HIGHLIGHT);
            if (annotation) {
                Clipboards.writeText(BlockTextHighlights.toText(annotation.content.value));
            }
        } else if (selectionEvent) {
            const selectedContent = SelectedContents.computeFromSelection(selectionEvent.selection, {
                noRectTexts: fileType === "epub",
                fileType,
            });

            Clipboards.writeText(selectedContent.text);
        }
    }, [fileType, annotationPopupStore, getBlock]);
};
