import React, {useRef} from "react";
import {useAnnotationPopup} from "../AnnotationPopupContext";
import {useAnnotationMutationsContext} from "../../../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {useDialogManager} from "../../../../../../web/js/mui/dialogs/MUIDialogControllers";
import {SimpleInputForm, InputOptions} from "./SimpleInputForm";
import {Refs} from "polar-shared/src/metadata/Refs";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {FlashcardTypeSelector} from "../../../../../../web/js/annotation_sidebar/child_annotations/flashcards/flashcard_input/FlashcardTypeSelector";
import {getDefaultFlashcardType} from "../../../../../../web/js/annotation_sidebar/child_annotations/flashcards/flashcard_input/FlashcardInput";
import {IAnnotationPopupActionProps} from "../AnnotationPopupActions";
import {MUITooltip} from "../../../../../../web/js/mui/MUITooltip";
import IconButton from "@material-ui/core/IconButton";
import {ClozeDeletions} from "../../../../../../web/js/annotation_sidebar/child_annotations/flashcards/flashcard_input/ClozeDeletions";
import {DocViewerGlobalHotKeys} from "../../../DocViewerGlobalHotKeys";
import {useDocViewerCallbacks} from "../../../DocViewerStore";
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

export const CreateFlashcard: React.FC<IAnnotationPopupActionProps> = (props) => {
    const {annotation, style = {}, className = ""} = props;
    const {clear} = useAnnotationPopup();
    const annotationMutations = useAnnotationMutationsContext();
    const dialogs = useDialogManager();
    const [flashcardType, setFlashcardType] = React.useState<CreatableFlashcardType>(() => getDefaultFlashcardType());
    const createFlashcard = annotationMutations.createFlashcardCallback(annotation);
    const clozeRef = useRef<HTMLInputElement>(null);

    const [inputs, setInputs]= React.useState<FormTypes>(() => {
        if (flashcardType === FlashcardType.CLOZE) {
            return {
                text: { placeholder: "Cloze text", rows: 3, initialValue: annotation.text, ref: clozeRef},
            };
        } else {
            return {
                front: { placeholder: "Front", rows: 2 },
                back: { placeholder: "Back", rows: 2, initialValue: annotation.text },
            };
        }
    });

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

    function onMouseDownHandler(event: React.MouseEvent){
        onClozeDelete();
        event.stopPropagation();
        event.preventDefault();
    }
    function onClozeDelete(): void {
         if(!clozeRef.current || !clozeRef.current.selectionStart || !clozeRef.current.selectionEnd ){
            return;
         }
        // compute the next close ID from the text
        const c = ClozeDeletions.next(clozeRef.current.value);
        const text = clozeRef.current.value;
        const clozedText = text.slice(clozeRef.current.selectionStart, clozeRef.current.selectionEnd);

        const firstSection = text.slice(0, clozeRef.current.selectionStart);

        const newValue = `{{c${c}::${clozedText}}}`;

        const secondSection = text.slice(clozeRef.current.selectionEnd);

        setInputs({text:
                            { placeholder: "Cloze text", rows: 3,
                            initialValue: firstSection + newValue + secondSection, ref: clozeRef}
                }
            );
    }
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
        }
    });
    const keyHandler = {
        CLOZE: onClozeDelete
    };

    return (
        <>
            <GlobalKeyboardShortcuts keyMap={keyMap} handlerMap={keyHandler}/>

            <SimpleInputForm<ClozeForm | BasicFrontBackForm>
                key={flashcardType}
                className={className}
                style={style}
                inputs={inputs}
                onCancel={clear}
                onSubmit={onSubmit}
                footer={footer}/>
        </>
    );
};
