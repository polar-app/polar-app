import React from "react";
import {getAnnotationData, useAnnotationPopup} from "../AnnotationPopupContext";
import {useAnnotationMutationsContext} from "../../../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {useDialogManager} from "../../../../../../web/js/mui/dialogs/MUIDialogControllers";
import {SimpleInputForm, InputOptions} from "./SimpleInputForm";
import {IAnnotationPopupActionProps} from "../AnnotationPopupActions";
import {ITextConverters} from "../../../../../../web/js/annotation_sidebar/DocAnnotations";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {useAnnotationBlockManager} from "../../../../../../web/js/notes/HighlightNotesUtils";
import {Texts} from "polar-shared/src/metadata/Texts";
import {TextType} from "polar-shared/src/metadata/TextType";

type EditAnnotationForm = {
    body: string;
};

export const EditAnnotation: React.FC<IAnnotationPopupActionProps> = (props) => {
    const { className = "", style = {}, annotation } = props;
    const { clear } = useAnnotationPopup();
    const annotationMutations = useAnnotationMutationsContext();
    const dialogs = useDialogManager();
    const { annotation: annotationData } = React.useMemo(() => getAnnotationData(annotation), [annotation]);
    const { update } = useAnnotationBlockManager();

    const inputs = React.useMemo<InputOptions<EditAnnotationForm>>(() => {
        const { text = "" } = ITextConverters.create(AnnotationType.TEXT_HIGHLIGHT, annotationData);

        return {
            body: {
                placeholder: "Highlight text",
                initialValue: text
            }
        };
    }, [annotationData]);

    const onSubmit = React.useCallback(({ body }: EditAnnotationForm) => {
        if (annotation.type === 'docMeta') {
            annotationMutations.onTextHighlight({
                selected: [annotation.annotation],
                type: "update",
                body,
            });
        } else {
            const contentJSON = annotation.annotation.content.toJSON();
            update(annotation.annotation.id, {
                ...contentJSON,
                value: { ...contentJSON.value, revisedText: Texts.create(body, TextType.MARKDOWN) }
            })
        }
        dialogs.snackbar({ message: "Highlight updated successfully." });
        clear();
    }, [annotationMutations, dialogs, clear, annotation, update]);

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
