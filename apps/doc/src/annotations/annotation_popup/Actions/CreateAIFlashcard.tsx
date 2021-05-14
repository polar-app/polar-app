import React from "react";
import {useAIFlashcardVerifiedAction} from "../../../../../repository/js/ui/AIFlashcardVerifiedAction";
import {useAutoFlashcardHandler} from "../../../../../../web/js/annotation_sidebar/AutoFlashcardHook";
import {useDialogManager} from "../../../../../../web/js/mui/dialogs/MUIDialogControllers";
import {useAnnotationPopup} from "../AnnotationPopupContext";
import {IAnnotationPopupActionProps} from "../AnnotationPopupActions";

export const CreateAIFlashcard: React.FC<IAnnotationPopupActionProps> = ({ annotation }) => {
    const {clear, setAiFlashcardStatus} = useAnnotationPopup();
    const [_, handler] = useAutoFlashcardHandler(annotation);
    const dialogs = useDialogManager();

    const verifiedAction = useAIFlashcardVerifiedAction();

    React.useEffect(() => {
        clear();
        verifiedAction(() => {
            setAiFlashcardStatus("waiting");
            handler()
                .then(() => {
                    dialogs.snackbar({ message: "AI Flashcard created successfully!" });
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
