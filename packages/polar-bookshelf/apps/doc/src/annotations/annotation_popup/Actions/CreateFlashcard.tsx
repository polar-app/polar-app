import React from "react";
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
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {useAnnotationPopupStore} from "../AnnotationPopupContext";

interface BasicFrontBackForm {
    readonly front: string;
    readonly back: string;
}

interface ClozeForm {
    readonly text: string;
}


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
    const { style, className, annotationID } = props;
    const annotationPopupStore = useAnnotationPopupStore();
    const [flashcardType, setFlashcardType] = React.useState<CreatableFlashcardType>(() => getDefaultFlashcardType());
    const clozeRef = React.useRef<HTMLInputElement>(null);
    const { getBlock } = useAnnotationBlockManager();

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

    const getAnnotationText = React.useCallback(() => {
        const annotation = getBlock(annotationID, AnnotationContentType.TEXT_HIGHLIGHT);
        return annotation ? BlockTextHighlights.toText(annotation.content.value) : "";
    }, [getBlock, annotationID]);

    const [inputs, setInputs] = React.useState<FormTypes>(() =>
        getInputsForType(flashcardType, getAnnotationText()));

    React.useEffect(() => {
        const text = getAnnotationText();

        setInputs(getInputsForType(flashcardType, text));
    }, [flashcardType, setInputs, annotationID, getInputsForType, getAnnotationText]);

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
            createFlashcard(annotationID, {
                type: FlashcardType.CLOZE,
                ...(data as ClozeForm),
            });
        } else {
            createFlashcard(annotationID, {
                type: FlashcardType.BASIC_FRONT_BACK,
                ...(data as BasicFrontBackForm),
            });
        }

        annotationPopupStore.clearActiveAction();
    }, [annotationID, annotationPopupStore, createFlashcard, flashcardType]);

    const keyHandler = React.useMemo(() => ({ CLOZE: onClozeDelete }), [onClozeDelete]);

    return(
        <>
            <GlobalKeyboardShortcuts keyMap={keyMap} handlerMap={keyHandler}/>

            <SimpleInputForm<ClozeForm | BasicFrontBackForm>
                key={flashcardType}
                className={className}
                style={style}
                inputs={inputs}
                onCancel={() => annotationPopupStore.clearActiveAction()}
                onSubmit={onSubmit}
                footer={footer}
            />
        </>
    );
};
