import React from "react";
import {getTextHighlightText, useAnnotationPopup} from "../AnnotationPopupContext";
import {useAnnotationMutationsContext} from "../../../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {useDialogManager} from "../../../../../../web/js/mui/dialogs/MUIDialogControllers";
import {SimpleInputForm, InputOptions} from "./SimpleInputForm";
import {IAnnotationPopupActionProps} from "../AnnotationPopupActions";
import {useBlocksStore} from "../../../../../../web/js/notes/store/BlocksStore";

type EditAnnotationForm = {
    body: string;
};

export const EditAnnotation: React.FC<IAnnotationPopupActionProps> = (props) => {
    const { className = "", style = {}, annotation } = props;
    const { clear } = useAnnotationPopup();
    const annotationMutations = useAnnotationMutationsContext();
    const dialogs = useDialogManager();
    const blocksStore = useBlocksStore();

    const inputs = React.useMemo<InputOptions<EditAnnotationForm>>(() => {
        const text = getTextHighlightText(annotation);

        return {
            body: {
                placeholder: "Highlight text",
                initialValue: text
            },
        };
    }, [annotation]);

    const onSubmit = React.useCallback(({ body }: EditAnnotationForm) => {
        if (annotation.type === 'docMeta') {
            annotationMutations.onTextHighlight({
                selected: [annotation.annotation],
                type: "update",
                body,
            });
        } else {
            const contentJSON = annotation.annotation.content.toJSON();
            blocksStore.setBlockContent(annotation.annotation.id, {
                ...contentJSON,
                value: { ...contentJSON.value, revisedText: body }
            })
        }
        dialogs.snackbar({ message: "Highlight updated successfully." });
        clear();
    }, [annotationMutations, dialogs, clear, annotation, blocksStore]);

    return (
        <SimpleInputForm
            className={className}
            style={style}
            inputs={inputs}
            onCancel={clear}
            onSubmit={onSubmit}
        />
    );
};
