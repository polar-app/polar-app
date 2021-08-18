import React from "react";
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
import {Ranges} from "../../../../../../web/js/highlights/text/selection/Ranges";
import {ClozeDeletions} from "../../../../../../web/js/annotation_sidebar/child_annotations/flashcards/flashcard_input/ClozeDeletions";

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
        <div >
            <FlashcardTypeSelector
                flashcardType={flashcardType}
                onChangeFlashcardType={(type) => setFlashcardType(type as CreatableFlashcardType)} />

            {flashcardType === FlashcardType.CLOZE &&
                <MUITooltip title="Create cloze deletion for text">
                    <IconButton onClick={() => onClozeDelete()}>
                        […]
                    </IconButton>
                </MUITooltip>
            }
        </div>
    );
    function onClozeDelete(): void { // make to a hook or HOF
            // TODO: don't use the top level window but get it from the proper
            // event
            const sel = window.getSelection();

            if (!sel) {
            return;
        }

        const range = sel.getRangeAt(0);

        const textNodes = Ranges.getTextNodes(range);

        if (textNodes.length === 0) {
            return;
        }

        // compute the next close ID from the text
        const c = ClozeDeletions.next(fields.text);

        const prefix = document.createTextNode(`{{c${c}::`);
        const suffix = document.createTextNode('}}');

        const firstNode = textNodes[0];
        const lastNode = textNodes[textNodes.length - 1];

        firstNode.parentNode!.insertBefore(prefix, firstNode);
        lastNode.parentNode!.insertBefore(suffix, lastNode.nextSibling);

        sel.removeAllRanges();

        this.fields.text = this.richTextMutator!.currentValue();

        // TODO this improperly sets the focus by moving the cursor to the
        // beginning
        this.richTextMutator!.focus();

    }
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
