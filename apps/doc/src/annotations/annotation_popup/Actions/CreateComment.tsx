import React from "react";
import {useAnnotationMutationsContext} from "../../../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {useDialogManager} from "../../../../../../web/js/mui/dialogs/MUIDialogControllers";
import {SimpleInputForm, InputOptions} from "./SimpleInputForm";
import {Refs} from "polar-shared/src/metadata/Refs";
import {IAnnotationPopupActionProps} from "../AnnotationPopupActions";
import {useAnnotationPopup} from "../AnnotationPopupContext";

type CreateCommentForm = {
    body: string;
};

const FORM_INPUTS: InputOptions<CreateCommentForm> = {
    body: { placeholder: "Comment" },
};

export const CreateComment: React.FC<IAnnotationPopupActionProps> = (props) => {
    const {style = {}, className = "", annotation} = props;
    const {clear} = useAnnotationPopup();
    const annotationMutations = useAnnotationMutationsContext();
    const dialogs = useDialogManager();
    const createComment = annotationMutations.createCommentCallback(annotation);

    const onSubmit = React.useCallback(({ body }: CreateCommentForm) => {
        createComment({
            type: "create",
            parent: Refs.createRef(annotation),
            body,
        });
        dialogs.snackbar({ message: "Comment created successfully!" });
        clear();
    }, [dialogs, clear, annotation, createComment]);

    return (
        <SimpleInputForm
            inputs={FORM_INPUTS}
            onCancel={clear}
            onSubmit={onSubmit}
            className={className}
            style={style}
        />
    );
};
