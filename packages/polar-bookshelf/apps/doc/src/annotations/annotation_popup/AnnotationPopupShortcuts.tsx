import React from "react";
import {MAIN_HIGHLIGHT_COLORS} from "../../../../../web/js/ui/ColorMenu";
import {useRefWithUpdates} from "../../../../../web/js/hooks/ReactHooks";
import {
    GlobalKeyboardShortcuts,
    HandlerMap,
    keyMapWithGroup
} from "../../../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts";
import {AnnotationPopupActionEnum, useAnnotationPopupStore} from "./AnnotationPopupContext";
import {ColorStr} from "../../../../../web/js/ui/colors/ColorSelectorBox";
import {usePersistentRouteContext} from "../../../../../web/js/apps/repository/PersistentRoute";
import {useBlocksStore} from "../../../../../web/js/notes/store/BlocksStore";
import {useCopyAnnotation} from "./Actions/Copy";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {useAnnotationBlockManager} from "../../../../../web/js/notes/HighlightBlocksHooks";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {useDeleteAnnotation} from "./Actions/DeleteAnnotation";

export const ANNOTATION_COLOR_SHORTCUT_KEYS = ["1", "2", "3", "4", "5", "6"];

const annotationBarColorsKeyMap = keyMapWithGroup({
    group: "Annotation Popup Bar",
    keyMap: {
        CHANGE_COLOR: {
            name: "Change Annotation Color",
            description: "Change the color of the selected annotation",
            sequences: ANNOTATION_COLOR_SHORTCUT_KEYS.map(k => ({
                keys: k,
                platforms: ['macos', 'windows','linux']
            })),
            priority: 1,
        },
    },
});

const annotationBarKeyMap = keyMapWithGroup({
    group: "Annotation Popup Bar",
    keyMap: {
        EDIT_ANNOTATION: {
            name: "Edit Annotation",
            description: "Edit the selected annotation",
            sequences: [{keys: "e", platforms: ['macos', 'windows', 'linux']}],
            priority: 2,
        },
        CREATE_COMMENT: {
            name: "Add Comment",
            description: "Add a comment to the selected annotation",
            sequences: [{ keys: "c", platforms: ['macos', 'windows', 'linux']}],
            priority: 3,
        },
        CREATE_FLASHCARD: {
            name: "Create Manual Flashcard",
            description: "Create a manual flashcard for the selected annotation",
            sequences: [{ keys: "f", platforms: ['macos', 'windows', 'linux']}],
            priority: 4,
        },
        CREATE_AI_FLASHCARD: {
            name: "Create AI Flashcard",
            description: "Generate an AI flashcard for the selected annotation",
            sequences: [{ keys: "g", platforms: ['macos', 'windows', 'linux']}],
            priority: 5,
        },
        CREATE_AI_CLOZE_FLASHCARD: {
            name: "Create AI Cloze Flashcard",
            description: "Generate an AI cloze deletion flashcard for the selected annotation",
            sequences: [{ keys: "h", platforms: ['macos', 'windows', 'linux']}],
            priority: 6,
        },
        EDIT_TAGS: {
            name: "Edit Tags",
            description: "Edit the tags of the selected annotation",
            sequences: [{ keys: "t", platforms: ['macos', 'windows', 'linux']}],
            priority: 7,
        },
        COPY_ANNOTATION: {
            name: "Copy Annotation",
            description: "Copy the text of the selected annotation",
            sequences: [{ keys: "ctrl+c", platforms: ['windows','linux']}, {keys: "command+c", platforms: ['macos']}],
            priority: 8,
        },
        DELETE: {
            name: "Delete Annotation",
            description: "Deleted the selected annotation",
            sequences: [{ keys: "d", platforms: ['macos', 'windows', 'linux']}],
            priority: 9,
        },
    },
});

export const AnnotationPopupShortcuts: React.FC = () => {
    const annotationPopupStore = useAnnotationPopupStore();
    const {active} = usePersistentRouteContext();

    const toggleActionRef = useRefWithUpdates((action: AnnotationPopupActionEnum) => annotationPopupStore.toggleActiveAction(action));
    const copyAnnotationRef = useRefWithUpdates(useCopyAnnotation());
    const deleteAnnotationRef = useRefWithUpdates(useDeleteAnnotation());

    const handlers = React.useMemo<HandlerMap>(() => ({
        EDIT_ANNOTATION: () => toggleActionRef.current(AnnotationPopupActionEnum.EDIT),
        COPY_ANNOTATION: () => copyAnnotationRef.current(),
        CREATE_COMMENT: () => toggleActionRef.current(AnnotationPopupActionEnum.CREATE_COMMENT),
        CREATE_FLASHCARD: () => toggleActionRef.current(AnnotationPopupActionEnum.CREATE_FLASHCARD),
        CREATE_AI_FLASHCARD: () => toggleActionRef.current(AnnotationPopupActionEnum.CREATE_AI_FLASHCARD),
        CREATE_AI_CLOZE_FLASHCARD: () => toggleActionRef.current(AnnotationPopupActionEnum.CREATE_AI_CLOZE_FLASHCARD),
        EDIT_TAGS: () => toggleActionRef.current(AnnotationPopupActionEnum.EDIT_TAGS),
        DELETE: () => deleteAnnotationRef.current(),
    }), [toggleActionRef, copyAnnotationRef, deleteAnnotationRef]);

    if (!active) {
        return null;
    }

    return (
        <>
            <GlobalKeyboardShortcuts keyMap={annotationBarKeyMap} handlerMap={handlers} />
            <ColorShortcuts />
        </>
    );
};

const keyToColor = (key: string): ColorStr | undefined => {
    const exists = ANNOTATION_COLOR_SHORTCUT_KEYS.indexOf(key) > -1;
    const id = +key - 1;
    if (exists && !isNaN(id)) {
        return MAIN_HIGHLIGHT_COLORS[id];
    }
    return undefined;
};

interface IHighlightColorShortcuts {
    readonly annotationID: BlockIDStr;
};

const HighlightColorShortcuts: React.FC<IHighlightColorShortcuts> = React.memo(({ annotationID }) => {
    const blocksStore = useBlocksStore();
    const {getBlock} = useAnnotationBlockManager();

    const handleColorChangeRef = useRefWithUpdates(({ key }: KeyboardEvent) => {
        const color = keyToColor(key);
        const annotation = getBlock(annotationID, AnnotationContentType.TEXT_HIGHLIGHT);

        if (! annotation || ! color || color === annotation.content.value.color) {
            return;
        }

        const contentJSON = annotation.content.toJSON();

        blocksStore.setBlockContent(annotation.id, {
            ...contentJSON,
            value: { ...contentJSON.value, color },
        });

    });

    const handlers = React.useMemo<HandlerMap>(() => ({
        CHANGE_COLOR: e => handleColorChangeRef.current(e as KeyboardEvent),
    }), [handleColorChangeRef]);

    return <GlobalKeyboardShortcuts keyMap={annotationBarColorsKeyMap} handlerMap={handlers}/>;
});

const SelectionColorShortcuts: React.FC = () => {
    const annotationPopupStore = useAnnotationPopupStore();

    const handleColorChangeRef = useRefWithUpdates(({ key }: KeyboardEvent) => {
        const color = keyToColor(key);

        const { selectionEvent } = annotationPopupStore;

        if (color && selectionEvent) {
            annotationPopupStore.createAnnotationFromSelectionEvent(color, selectionEvent);
        }
    });

    const handlers = React.useMemo<HandlerMap>(() => ({
        CHANGE_COLOR: e => handleColorChangeRef.current(e as KeyboardEvent),
    }), [handleColorChangeRef]);

    return <GlobalKeyboardShortcuts keyMap={annotationBarColorsKeyMap} handlerMap={handlers}/>;
};

const ColorShortcuts: React.FC = () => {
    const { selectedAnnotationID } = useAnnotationPopupStore();

    if (selectedAnnotationID) {
        return <HighlightColorShortcuts annotationID={selectedAnnotationID} />;
    }

    return <SelectionColorShortcuts />;
};
