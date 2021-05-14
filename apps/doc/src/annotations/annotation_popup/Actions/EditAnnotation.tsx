import React from "react";
import {useAnnotationPopup} from "../AnnotationPopupContext";
import {useAnnotationMutationsContext} from "../../../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {useDialogManager} from "../../../../../../web/js/mui/dialogs/MUIDialogControllers";
import {SimpleInputForm, InputOptions} from "./SimpleInputForm";
import {IAnnotationPopupActionProps} from "../AnnotationPopupActions";

type EditAnnotationForm = {
    body: string;
};

export const EditAnnotation: React.FC<IAnnotationPopupActionProps> = (props) => {
    const {className = "", style = {}, annotation} = props;
    const {clear} = useAnnotationPopup();
    const annotationMutations = useAnnotationMutationsContext();
    const dialogs = useDialogManager();

    const inputs = React.useMemo<InputOptions<EditAnnotationForm>>(() => ({
        body: { placeholder: "Highlight text", initialValue: annotation.text || "" }
    }), [annotation.text]);

    const onSubmit = React.useCallback(({ body }: EditAnnotationForm) => {
        annotationMutations.onTextHighlight({
            selected: [annotation],
            type: "update",
            body,
        });
        dialogs.snackbar({ message: "Highlight updated successfully." });
        clear();
    }, [annotationMutations, dialogs, clear, annotation]);

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
