import React from "react";
import {MAIN_HIGHLIGHT_COLORS} from "../../../../../web/js/ui/ColorMenu";
import {useRefWithUpdates} from "../../../../../web/js/hooks/ReactHooks";
import {
    GlobalKeyboardShortcuts,
    HandlerMap,
    keyMapWithGroup
} from "../../../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts";
import {AnnotationPopupActionEnum, useAnnotationPopup} from "./AnnotationPopupContext";
import {useAnnotationMutationsContext} from "../../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {ColorStr} from "../../../../../web/js/ui/colors/ColorSelectorBox";
import {usePersistentRouteContext} from "../../../../../web/js/apps/repository/PersistentRoute";
import {useCopyAnnotation} from "./AnnotationPopupBar";
import {IBlockAnnotation, IDocMetaAnnotation} from "./AnnotationPopupReducer";
import {IBlockAnnotationProps, IDocMetaAnnotationProps} from "./AnnotationPopupActions";
import {useBlocksStore} from "../../../../../web/js/notes/store/BlocksStore";

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
        EDIT_TAGS: {
            name: "Edit Tags",
            description: "Edit the tags of the selected annotation",
            sequences: [{ keys: "t", platforms: ['macos', 'windows', 'linux']}],
            priority: 6,
        },
        COPY_ANNOTATION: {
            name: "Copy Annotation",
            description: "Copy the text of the selected annotation",
            sequences: [{ keys: "ctrl+c", platforms: ['windows','linux']}, {keys: "command+c", platforms: ['macos']}],
            priority: 7,
        },
        DELETE: {
            name: "Delete Annotation",
            description: "Deleted the selected annotation",
            sequences: [{ keys: "d", platforms: ['macos', 'windows', 'linux']}],
            priority: 8,
        },
    },
});

export const AnnotationPopupShortcuts: React.FC = () => {
    const {toggleAction} = useAnnotationPopup();
    const {active} = usePersistentRouteContext();
    const copyAnnotation = useCopyAnnotation();

    const toggleActionRef = useRefWithUpdates((action: AnnotationPopupActionEnum) => toggleAction(action)());
    const copyAnnotationRef = useRefWithUpdates(() => copyAnnotation());

    const handlers = React.useMemo<HandlerMap>(() => ({
        EDIT_ANNOTATION: () => toggleActionRef.current(AnnotationPopupActionEnum.EDIT),
        COPY_ANNOTATION: () => copyAnnotationRef.current(),
        CREATE_COMMENT: () => toggleActionRef.current(AnnotationPopupActionEnum.CREATE_COMMENT),
        CREATE_FLASHCARD: () => toggleActionRef.current(AnnotationPopupActionEnum.CREATE_FLASHCARD),
        CREATE_AI_FLASHCARD: () => toggleActionRef.current(AnnotationPopupActionEnum.CREATE_AI_FLASHCARD),
        EDIT_TAGS: () => toggleActionRef.current(AnnotationPopupActionEnum.EDIT_TAGS),
        DELETE: () => toggleActionRef.current(AnnotationPopupActionEnum.DELETE),
    }), [toggleActionRef, copyAnnotationRef]);

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

type IHighlightColorShortcuts = {
    readonly annotation: IDocMetaAnnotation | IBlockAnnotation;
};

const HighlightColorShortcuts: React.FC<IHighlightColorShortcuts> = ({ annotation }) => {

    const DocMetaColorChanger: React.FC<IDocMetaAnnotationProps> = ({ annotation }) => {
        const annotationMutations = useAnnotationMutationsContext();
        const handleColor = annotationMutations.createColorCallback({ selected: [annotation] });
        const handleColorChangeRef = useRefWithUpdates(({ key }: KeyboardEvent) => {
            const color = keyToColor(key);
            if (color && color !== annotation.color) {
                handleColor({ color });
            }
        });

        const handlers = React.useMemo<HandlerMap>(() => ({
            CHANGE_COLOR: e => handleColorChangeRef.current(e as KeyboardEvent),
        }), [handleColorChangeRef]);
        return <GlobalKeyboardShortcuts keyMap={annotationBarColorsKeyMap} handlerMap={handlers}/>;
    };

    const BlockColorChanger: React.FC<IBlockAnnotationProps> = ({ annotation }) => {
        const blocksStore = useBlocksStore();
        const handleColorChangeRef = useRefWithUpdates(({ key }: KeyboardEvent) => {
            const color = keyToColor(key);
            if (color && color !== annotation.content.value.color) {
                const contentJSON = annotation.content.toJSON();
                blocksStore.setBlockContent(annotation.id, {
                    ...contentJSON,
                    value: { ...contentJSON.value, color }
                });
            }
        });

        const handlers = React.useMemo<HandlerMap>(() => ({
            CHANGE_COLOR: e => handleColorChangeRef.current(e as KeyboardEvent),
        }), [handleColorChangeRef]);
        return <GlobalKeyboardShortcuts keyMap={annotationBarColorsKeyMap} handlerMap={handlers}/>;
    };

    return annotation.type === 'docMeta'
        ? <DocMetaColorChanger annotation={annotation.annotation} />
        : <BlockColorChanger annotation={annotation.annotation} />;
};

const SelectionColorShortcuts: React.FC = () => {
    const {onCreateAnnotation} = useAnnotationPopup();

    const handleColorChangeRef = useRefWithUpdates(({key}: KeyboardEvent) => {
        const color = keyToColor(key);
        if (color) {
            onCreateAnnotation(color);
        }
    });

    const handlers = React.useMemo<HandlerMap>(() => ({
        CHANGE_COLOR: e => handleColorChangeRef.current(e as KeyboardEvent),
    }), [handleColorChangeRef]);

    return <GlobalKeyboardShortcuts keyMap={annotationBarColorsKeyMap} handlerMap={handlers}/>;
};

const ColorShortcuts: React.FC = () => {
    const {annotation} = useAnnotationPopup();

    if (annotation) {
        return <HighlightColorShortcuts annotation={annotation} />;
    }

    return <SelectionColorShortcuts />;
};
