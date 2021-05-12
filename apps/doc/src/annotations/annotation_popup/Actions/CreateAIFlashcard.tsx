import React from "react";
import {useAIFlashcardVerifiedAction} from "../../../../../repository/js/ui/AIFlashcardVerifiedAction";
import {useAutoFlashcardHandler} from "../../../../../../web/js/annotation_sidebar/AutoFlashcardHook";
import {useDialogManager} from "../../../../../../web/js/mui/dialogs/MUIDialogControllers";
import {useAnnotationPopupAction} from "../AnnotationPopupActionContext";
import {IAnnotationPopupActionProps} from "../AnnotationPopupActions";

export const CreateAIFlashcard: React.FC<IAnnotationPopupActionProps> = ({ annotation }) => {
    const {clear} = useAnnotationPopupAction();
    const [, handler] = useAutoFlashcardHandler(annotation);
    const dialogs = useDialogManager();

    const verifiedAction = useAIFlashcardVerifiedAction();

    React.useEffect(() => {
        clear();
        verifiedAction(() => {
            handler()
                .then(() => dialogs.snackbar({ message: "AI Flashcard created successfully!" }))
                .catch(err => console.error("Could not handle verified action: ", err));
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div />;
};
