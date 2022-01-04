import React from "react";
import {useAIFlashcardVerifiedAction} from "../../../../../repository/js/ui/AIFlashcardVerifiedAction";
import {useAutoFlashcardBlockCreator} from "../../../../../../web/js/annotation_sidebar/AutoFlashcardHook";
import {useDialogManager} from "../../../../../../web/js/mui/dialogs/MUIDialogControllers";
import {useAnnotationPopup} from "../AnnotationPopupContext";
import {BlockTextHighlights} from "polar-blocks/src/annotations/BlockTextHighlights";
import {IAnnotationPopupActionProps} from "../IAnnotationPopupActionProps";

export const CreateAIFlashcard: React.FC<IAnnotationPopupActionProps> = ({ annotation }) => {
    const {clear, setAiFlashcardStatus} = useAnnotationPopup();
    const dialogs = useDialogManager();
    const [_, handler] = useAutoFlashcardBlockCreator();

    const verifiedAction = useAIFlashcardVerifiedAction();

    React.useEffect(() => {
        clear();

        verifiedAction(() => {
            setAiFlashcardStatus("waiting");
            handler(annotation.id, BlockTextHighlights.toText(annotation.content.value))
                .then(() => {
                    setAiFlashcardStatus("idle");
                }).catch((e) => {
                    console.error("Could not handle verified action: ", e);
                    setAiFlashcardStatus("idle");
                });
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div />;
};
