import React from "react";
import {useAIFlashcardVerifiedAction} from "../../../../../repository/js/ui/AIFlashcardVerifiedAction";
import {
    useAutoFlashcardBlockCreator,
    useAutoFlashcardCreator
} from "../../../../../../web/js/annotation_sidebar/AutoFlashcardHook";
import {useDialogManager} from "../../../../../../web/js/mui/dialogs/MUIDialogControllers";
import {useAnnotationPopup} from "../AnnotationPopupContext";
import {BlockTextHighlights} from "polar-blocks/src/annotations/BlockTextHighlights";
import {IDocMetaAnnotationProps} from "../IDocMetaAnnotationProps";
import {IBlockAnnotationProps} from "../IBlockAnnotationProps";
import {IAnnotationPopupActionProps} from "../IAnnotationPopupActionProps";

export const CreateAIFlashcard: React.FC<IAnnotationPopupActionProps> = ({ annotation }) => {
    const {clear, setAiFlashcardStatus} = useAnnotationPopup();

    const DocMetaCreateAIFlashcard: React.FC<IDocMetaAnnotationProps> = ({ annotation }) => {
        const [_, handler] = useAutoFlashcardCreator(annotation);
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

    const BlockCreateAIFlashcard: React.FC<IBlockAnnotationProps> = ({ annotation }) => {
        const dialogs = useDialogManager();
        const [_, handler] = useAutoFlashcardBlockCreator();

        const verifiedAction = useAIFlashcardVerifiedAction();

        React.useEffect(() => {
            clear();

            verifiedAction(() => {
                setAiFlashcardStatus("waiting");
                handler(annotation.id, BlockTextHighlights.toText(annotation.content.value))
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


    return annotation.type === 'docMeta'
        ? <DocMetaCreateAIFlashcard annotation={annotation.annotation} />
        : <BlockCreateAIFlashcard annotation={annotation.annotation} />
};
