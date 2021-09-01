import React from "react";
import {getAnnotationData, useAnnotationPopup} from "../AnnotationPopupContext";
import {useAnnotationMutationsContext} from "../../../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {useDialogManager} from "../../../../../../web/js/mui/dialogs/MUIDialogControllers";
import {SimpleInputForm, InputOptions} from "./SimpleInputForm";
import {Refs} from "polar-shared/src/metadata/Refs";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {FlashcardTypeSelector} from "../../../../../../web/js/annotation_sidebar/child_annotations/flashcards/flashcard_input/FlashcardTypeSelector";
import {getDefaultFlashcardType} from "../../../../../../web/js/annotation_sidebar/child_annotations/flashcards/flashcard_input/FlashcardInput";
import {IAnnotationPopupActionProps, IBlockAnnotationProps, IDocMetaAnnotationProps} from "../AnnotationPopupActions";
import {ITextConverters} from "../../../../../../web/js/annotation_sidebar/DocAnnotations";
import {AnnotationType} from "../../../../../../../polar-app-public/polar-shared/src/metadata/AnnotationType";
import {useAnnotationBlockManager} from "../../../../../../web/js/notes/HighlightNotesUtils";

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
    const { annotation, style = {}, className = "" } = props;
    const { clear } = useAnnotationPopup();
    const annotationMutations = useAnnotationMutationsContext();
    const dialogs = useDialogManager();
    const [flashcardType, setFlashcardType] = React.useState<CreatableFlashcardType>(() => getDefaultFlashcardType());
    const { annotation: annotationData } = React.useMemo(() => getAnnotationData(annotation), [annotation]);

    const inputs = React.useMemo<FormTypes>(() => {
        const { text = "" } = ITextConverters.create(AnnotationType.TEXT_HIGHLIGHT, annotationData);

        if (flashcardType === FlashcardType.CLOZE) {
            return {
                text: { placeholder: "Cloze text", rows: 3, initialValue: text },
            };
        } else {
            return {
                front: { placeholder: "Front", rows: 2 },
                back: { placeholder: "Back", rows: 2, initialValue: text },
            };
        }
    }, [annotationData, flashcardType]);

    const footer = (
        <FlashcardTypeSelector
            flashcardType={flashcardType}
            onChangeFlashcardType={(type) => setFlashcardType(type as CreatableFlashcardType)} />
    );

    const DocMetaCreateFlashcard: React.FC<IDocMetaAnnotationProps> = ({ annotation }) => {
        const createFlashcard = annotationMutations.createFlashcardCallback(annotation);
        const onSubmit = React.useCallback((data: ClozeForm | BasicFrontBackForm) => {
            createFlashcard({
                type: "create",
                parent: Refs.createRef(annotation),
                flashcardType,
                fields: data,
            });
            dialogs.snackbar({ message: "Flashcard created successfully!" });
            clear();
        }, [createFlashcard, annotation]);

        return (
            <SimpleInputForm<ClozeForm | BasicFrontBackForm>
                key={flashcardType}
                className={className}
                style={style}
                inputs={inputs}
                onCancel={clear}
                onSubmit={onSubmit}
                footer={footer}
            />
        );
    };

    const BlockCreateFlashcard: React.FC<IBlockAnnotationProps> = ({ annotation }) => {
        const { createFlashcard } = useAnnotationBlockManager();
        const onSubmit = React.useCallback((data: ClozeForm | BasicFrontBackForm) => {
            if (flashcardType === FlashcardType.CLOZE) {
                createFlashcard(annotation.id, {
                    type: FlashcardType.CLOZE,
                    ...(data as ClozeForm),
                })
            } else {
                createFlashcard(annotation.id, {
                    type: FlashcardType.BASIC_FRONT_BACK,
                    ...(data as BasicFrontBackForm),
                })
            }

            dialogs.snackbar({ message: "Flashcard created successfully!" });
            clear();
        }, [annotation, createFlashcard]);

        return (
            <SimpleInputForm<ClozeForm | BasicFrontBackForm>
                key={flashcardType}
                className={className}
                style={style}
                inputs={inputs}
                onCancel={clear}
                onSubmit={onSubmit}
                footer={footer}
            />
        );
    };

    return annotation.type === 'docMeta'
        ? <DocMetaCreateFlashcard annotation={annotation.annotation} />
        : <BlockCreateFlashcard annotation={annotation.annotation} />
};
