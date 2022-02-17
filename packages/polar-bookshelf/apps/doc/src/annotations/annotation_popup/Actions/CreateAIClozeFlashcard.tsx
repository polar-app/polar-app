import React from "react";
import {IAnnotationPopupActionProps} from "../IAnnotationPopupActionProps";
import {useAnnotationPopupStore} from "../AnnotationPopupContext";
import {useAutoClozeDeletionBlock} from "../../../../../../web/js/annotation_sidebar/AutoClozeDeletionHook";
import {usePremiumFeatureCallback} from "../../../../../../apps/repository/js/ui/usePremiumFeatureCallback";

export const CreateAIClozeFlashcard: React.FC<IAnnotationPopupActionProps> = (props) => {
    const { annotationID } = props;
    const [_, aiClozeDeletionHandler] = useAutoClozeDeletionBlock();
    const annotationPopupStore = useAnnotationPopupStore();

    const handleAIClozeFlashcard = React.useCallback(() => {
        annotationPopupStore.clearActiveAction();

        if (annotationPopupStore.aiClozeFlashcardStatus === 'waiting') {
            return;
        }

        annotationPopupStore.setAiClozeFlashcardStatus("waiting");

        aiClozeDeletionHandler(annotationID)
            .then(() => {
                annotationPopupStore.setAiClozeFlashcardStatus('idle');
            }).catch(e => {
                annotationPopupStore.setAiClozeFlashcardStatus('idle');
                console.error("Could not handle verified action: ", e)
            });
    }, [annotationID, annotationPopupStore, aiClozeDeletionHandler]);

    const triggerAIClozeFlashcard = usePremiumFeatureCallback(handleAIClozeFlashcard);

    React.useEffect(() => {

        triggerAIClozeFlashcard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div />;
};
