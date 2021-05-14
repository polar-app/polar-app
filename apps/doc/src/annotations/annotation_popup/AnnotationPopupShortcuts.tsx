import React from "react";
import {MAIN_HIGHLIGHT_COLORS} from "../../../../../web/js/ui/ColorMenu";
import {useRefWithUpdates} from "../../../../../web/js/hooks/ReactHooks";
import {GlobalKeyboardShortcuts, HandlerMap, keyMapWithGroup} from "../../../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts";
import {AnnotationPopupActionEnum, useAnnotationPopup} from "./AnnotationPopupContext";

const globalKeyMap = keyMapWithGroup({
    group: "Annotation Popup Bar",
    keyMap: {
        CREATE_ANNOTATION: {
            name: "Create annotation",
            description: "Create an annotation with a specific color", 
            sequences: ["1", "2", "3", "4", "5", "6"],
            priority: 1,
        },
        EDIT_ANNOTATION: {
            name: "Edit Annotation",
            description: "Edit the selected annotation",
            sequences: ["e"],
            priority: 2,
        },
        CREATE_COMMENT: {
            name: "Add Comment",
            description: "Add a comment to the selected annotation",
            sequences: ["c"],
            priority: 3,
        },
        CREATE_FLASHCARD: {
            name: "Create Manual Flashcard",
            description: "Create a manual flashcard for the selected annotation",
            sequences: ["f"],
            priority: 4,
        },
        CREATE_AI_FLASHCARD: {
            name: "Create AI Flashcard",
            description: "Generate an AI flashcard for the selected annotation",
            sequences: ["g"],
            priority: 5,
        },
        EDIT_TAGS: {
            name: "Edit Tags",
            description: "Edit the tags of the selected annotation",
            sequences: ["t"],
            priority: 6,
        },
        COPY_ANNOTATION: {
            name: "Copy Annotation",
            description: "Copy the text of the selected annotation",
            sequences: ["ctrl+c", "command+c"],
            priority: 7,
        },
        DELETE: {
            name: "Delete Annotation",
            description: "Deleted the selected annotation",
            sequences: ["d"],
            priority: 8,
        },
    },
});

export const AnnotationPopupShortcuts: React.FC = () => {
    const {toggleAction, onCreateAnnotation} = useAnnotationPopup();

    const handleColorChange = useRefWithUpdates(({key}: KeyboardEvent) => {
        if (~["1", "2", "3", "4", "5"].indexOf(key)) {
            onCreateAnnotation(MAIN_HIGHLIGHT_COLORS[+key - 1]);
        }
    });

    const handlers = React.useMemo<HandlerMap>(() => ({
        CREATE_ANNOTATION: e => handleColorChange.current(e as KeyboardEvent),
        EDIT_ANNOTATION: toggleAction(AnnotationPopupActionEnum.EDIT),
        COPY_ANNOTATION: toggleAction(AnnotationPopupActionEnum.COPY),
        CREATE_COMMENT: toggleAction(AnnotationPopupActionEnum.CREATE_COMMENT),
        CREATE_FLASHCARD: toggleAction(AnnotationPopupActionEnum.CREATE_FLASHCARD),
        CREATE_AI_FLASHCARD: toggleAction(AnnotationPopupActionEnum.CREATE_AI_FLASHCARD),
        EDIT_TAGS: toggleAction(AnnotationPopupActionEnum.EDIT_TAGS),
        DELETE: toggleAction(AnnotationPopupActionEnum.DELETE),
    }), [toggleAction]);

    return (
        <GlobalKeyboardShortcuts keyMap={globalKeyMap} handlerMap={handlers}/>
    );
};
