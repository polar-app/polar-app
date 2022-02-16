import React from "react";
import {useAIFlashcardVerifiedAction} from "../../../../../repository/js/ui/AIFlashcardVerifiedAction";
import {useAutoFlashcardBlockCreator} from "../../../../../../web/js/annotation_sidebar/AutoFlashcardHook";
import {BlockTextHighlights} from "polar-blocks/src/annotations/BlockTextHighlights";
import {IAnnotationPopupActionProps} from "../IAnnotationPopupActionProps";
import {useAnnotationBlockManager} from "../../../../../../web/js/notes/HighlightBlocksHooks";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {useAnnotationPopupStore} from "../AnnotationPopupContext";

export const CreateAIFlashcard: React.FC<IAnnotationPopupActionProps> = (props) => {
    const { annotationID } = props;
    const annotationPopupStore = useAnnotationPopupStore();
    const {getBlock} = useAnnotationBlockManager();
    const [_, handler] = useAutoFlashcardBlockCreator();

    const verifiedAction = useAIFlashcardVerifiedAction();

    React.useEffect(() => {
        annotationPopupStore.clearActiveAction();
        const annotation = getBlock(annotationID, AnnotationContentType.TEXT_HIGHLIGHT);

        if (! annotation) {
            return;
        }

        verifiedAction(() => {
            annotationPopupStore.setAiFlashcardStatus("waiting");

            handler(annotation.id, BlockTextHighlights.toText(annotation.content.value))
                .then(() => {
                    annotationPopupStore.setAiFlashcardStatus("idle");
                }).catch((e) => {
                    console.error("Could not handle verified action: ", e);
                    annotationPopupStore.setAiFlashcardStatus("idle");
                });
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div />;
};
