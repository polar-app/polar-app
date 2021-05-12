import React from "react";
import {useAnnotationPopupAction} from "../AnnotationPopupActionContext";
import {useAnnotationMutationsContext} from "../../../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {useDialogManager} from "../../../../../../web/js/mui/dialogs/MUIDialogControllers";
import {SimpleInputForm, InputOptions} from "./SimpleInputForm";
import {Refs} from "polar-shared/src/metadata/Refs";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {FlashcardTypeSelector} from "../../../../../../web/js/annotation_sidebar/child_annotations/flashcards/flashcard_input/FlashcardTypeSelector";
import {getDefaultFlashcardType} from "../../../../../../web/js/annotation_sidebar/child_annotations/flashcards/flashcard_input/FlashcardInput";
import {IAnnotationPopupActionProps} from "../AnnotationPopupActions";

type BasicFrontBackForm = {
    front: string;
    back: string;
}

type ClozeForm = {
    text: string;
};

type FormTypes = InputOptions<BasicFrontBackForm> | InputOptions<ClozeForm>;

type CreatableFlashcardType = FlashcardType.CLOZE | FlashcardType.BASIC_FRONT_BACK;

export const CreateFlashcard: React.FC<IAnnotationPopupActionProps> = (props) => {
    const {annotation, style = {}, className = ""} = props;
    const {clear} = useAnnotationPopupAction();
    const annotationMutations = useAnnotationMutationsContext();
    const dialogs = useDialogManager();
    const [flashcardType, setFlashcardType] = React.useState<CreatableFlashcardType>(() => getDefaultFlashcardType());
    const createFlashcard = annotationMutations.createFlashcardCallback(annotation);

    const inputs = React.useMemo<FormTypes>(() => {
        if (flashcardType === FlashcardType.CLOZE) {
            return {
                text: { placeholder: "Cloze text", rows: 3, initialValue: annotation.text },
            };
        } else {
            return {
                front: { placeholder: "Front", rows: 2 },
                back: { placeholder: "Back", rows: 2, initialValue: annotation.text },
            };
        }
    }, [annotation, flashcardType]);

    const onSubmit = React.useCallback((data: ClozeForm | BasicFrontBackForm) => {
        createFlashcard({
            type: "create",
            parent: Refs.createRef(annotation),
            flashcardType,
            fields: data,
        });
        dialogs.snackbar({ message: "Flashcard created successfully!" });
        clear();
    }, [createFlashcard, annotation, clear, dialogs, flashcardType]);

    const footer = (
        <FlashcardTypeSelector
            flashcardType={flashcardType}
            onChangeFlashcardType={(type) => setFlashcardType(type as CreatableFlashcardType)} />
    );

    return (
        <SimpleInputForm<ClozeForm | BasicFrontBackForm>
            className={className}
            style={style}
            inputs={inputs}
            onCancel={clear}
            onSubmit={onSubmit}
            footer={footer}
        />
    );
};
