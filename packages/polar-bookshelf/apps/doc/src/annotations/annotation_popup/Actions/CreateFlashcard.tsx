import React from "react";
import {useAnnotationPopup} from "../AnnotationPopupContext";
import {InputOptions, SimpleInputForm} from "./SimpleInputForm";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {FlashcardTypeSelector} from "../../../../../../web/js/annotation_sidebar/child_annotations/flashcards/flashcard_input/FlashcardTypeSelector";
import {useAnnotationBlockManager} from "../../../../../../web/js/notes/HighlightBlocksHooks";
import {MUITooltip} from "../../../../../../web/js/mui/MUITooltip";
import IconButton from "@material-ui/core/IconButton";
import {ClozeDeletions} from "../../../../../../web/js/annotation_sidebar/child_annotations/flashcards/flashcard_input/ClozeDeletions";
import {
    GlobalKeyboardShortcuts,
    keyMapWithGroup
} from "../../../../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts";
import {IAnnotationPopupActionProps} from "../IAnnotationPopupActionProps";
import {getDefaultFlashcardType} from "../../../../../../web/js/annotation_sidebar/child_annotations/flashcards/flashcard_input/GetDefaultFlashcardType";
import {BlockTextHighlights} from "polar-blocks/src/annotations/BlockTextHighlights";

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
    const [flashcardType, setFlashcardType] = React.useState<CreatableFlashcardType>(() => getDefaultFlashcardType());
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

    const [inputs, setInputs] = React.useState<FormTypes>(() => {
        const text = BlockTextHighlights.toText(annotation.content.value);
        return getInputsForType(flashcardType, text);
    });

    React.useEffect(() => {
        const text = BlockTextHighlights.toText(annotation.content.value);
        setInputs(getInputsForType(flashcardType, text));
    }, [flashcardType, setInputs, annotation, getInputsForType]);

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

    const footer = React.useMemo(() => (
        <div>
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
    ), [flashcardType, onMouseDownHandler]);

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

        clear();
    }, [annotation, createFlashcard, flashcardType, clear]);

    const keyHandler = React.useMemo(() => ({ CLOZE: onClozeDelete }), [onClozeDelete]);

    return(
        <>
            <GlobalKeyboardShortcuts keyMap={keyMap} handlerMap={keyHandler}/>

            <SimpleInputForm<ClozeForm | BasicFrontBackForm>
                key={flashcardType}
                className={className}
                style={style}
                inputs={inputs}
                onCancel={clear}
                onSubmit={onSubmit}
                footer={footer}
            />
        </>
    );
};
