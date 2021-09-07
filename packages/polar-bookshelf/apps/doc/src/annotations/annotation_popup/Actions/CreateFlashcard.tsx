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
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {useAnnotationBlockManager} from "../../../../../../web/js/notes/HighlightNotesUtils";
import {MUITooltip} from "../../../../../../web/js/mui/MUITooltip";
import IconButton from "@material-ui/core/IconButton";
import {ClozeDeletions} from "../../../../../../web/js/annotation_sidebar/child_annotations/flashcards/flashcard_input/ClozeDeletions";
import {
    GlobalKeyboardShortcuts,
    keyMapWithGroup
} from "../../../../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts";

type BasicFrontBackForm = {
    front: string;
    back: string;
}

type ClozeForm = {
    text: string;
};


type FormTypes = InputOptions<BasicFrontBackForm> | InputOptions<ClozeForm>;

type CreatableFlashcardType = FlashcardType.CLOZE | FlashcardType.BASIC_FRONT_BACK;

const keyMap = keyMapWithGroup({
    group: "Document Viewer",
    keyMap: {
        CLOZE: {
            name: "Cloze",
            description: "Cloze doc",
            ignorable: false,
            sequences: [
                {
                    keys: 'command+shift+alt+C',
                    platforms: ['macos']
                },
                {
                    keys: 'ctrl+shift+alt+C',
                    platforms: ['linux', 'windows']
                }
            ]
        }
    },
});

export const CreateFlashcard: React.FC<IAnnotationPopupActionProps> = (props) => {
    const { annotation, style = {}, className = "" } = props;
    const { clear } = useAnnotationPopup();
    const annotationMutations = useAnnotationMutationsContext();
    const dialogs = useDialogManager();
    const [flashcardType, setFlashcardType] = React.useState<CreatableFlashcardType>(() => getDefaultFlashcardType());
    const { annotation: annotationData } = React.useMemo(() => getAnnotationData(annotation), [annotation]);

    const clozeRef = React.useRef<HTMLInputElement>(null);

    const getInputsForType = React.useCallback((flashcardType: FlashcardType, initialValue: string) => {
        if (flashcardType === FlashcardType.CLOZE) {
            return {
                text: { placeholder: "Cloze text", rows: 3, initialValue, ref: clozeRef},
            };
        } else {
            return {
                front: { placeholder: "Front", rows: 2 },
                back: { placeholder: "Back", rows: 2, initialValue },
            };
        }
    }, []);

    const [inputs, setInputs]= React.useState<FormTypes>(() => {
        const { text = "" } = ITextConverters.create(AnnotationType.TEXT_HIGHLIGHT, annotationData);
        return getInputsForType(flashcardType, text);
    });

    React.useEffect(() => {
        const { text = "" } = ITextConverters.create(AnnotationType.TEXT_HIGHLIGHT, annotationData);
        setInputs(getInputsForType(flashcardType, text));
    }, [flashcardType, setInputs, annotationData]);

    const onClozeDelete = React.useCallback(() => {
        const elem = clozeRef.current;
        if (! elem || ! elem.selectionStart || ! elem.selectionEnd) {
            return;
        }

        // compute the next close ID from the text
        const c = ClozeDeletions.next(elem.value);
        const text = elem.value;
        const clozedText = text.slice(elem.selectionStart, elem.selectionEnd);

        const firstSection = text.slice(0, elem.selectionStart);

        const newValue = `{{c${c}::${clozedText}}}`;

        const secondSection = text.slice(elem.selectionEnd);

        setInputs({
            text: {
                placeholder: "Cloze text",
                rows: 3,
                initialValue: firstSection + newValue + secondSection,
                ref: clozeRef
            }
        });
    }, []);

    const onMouseDownHandler = React.useCallback((event: React.MouseEvent) => {
        onClozeDelete();
        event.stopPropagation();
        event.preventDefault();
    }, [onClozeDelete]);

    const footer = (
        <div >
            <FlashcardTypeSelector
                flashcardType={flashcardType}
                onChangeFlashcardType={(type) => setFlashcardType(type as CreatableFlashcardType)} />

            {flashcardType === FlashcardType.CLOZE &&
                <MUITooltip title="Create cloze deletion for text">
                    <IconButton onMouseDown={onMouseDownHandler}>
                        […]
                    </IconButton>
                </MUITooltip>
            }
        </div>
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

    const keyHandler = {
        CLOZE: onClozeDelete
    };

    return(
        <>
            <GlobalKeyboardShortcuts keyMap={keyMap} handlerMap={keyHandler}/>

            {annotation.type === 'docMeta'
                ? <DocMetaCreateFlashcard annotation={annotation.annotation} />
                : <BlockCreateFlashcard annotation={annotation.annotation} />
            }
        </>
    );
};
