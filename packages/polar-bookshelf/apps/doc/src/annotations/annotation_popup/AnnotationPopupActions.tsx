import React from "react";
import clsx from "clsx";
import {createStyles, Grow, makeStyles} from "@material-ui/core";
import {AnnotationPopupActionEnum, useAnnotationPopup} from "./AnnotationPopupContext";
import {ColorMenu} from "../../../../../web/js/ui/ColorMenu";
import {ColorStr} from "../../../../../web/js/ui/colors/ColorSelectorBox";
import {EditAnnotation} from "./Actions/EditAnnotation";
import {CreateComment} from "./Actions/CreateComment";
import {CreateFlashcard} from "./Actions/CreateFlashcard";
import {CreateAIFlashcard} from "./Actions/CreateAIFlashcard";
import {EditTags} from "./Actions/EditTags";
import {DeleteAnnotation} from "./Actions/DeleteAnnotation";
import {ANNOTATION_COLOR_SHORTCUT_KEYS} from "./AnnotationPopupShortcuts";
import {useBlocksStore} from "../../../../../web/js/notes/store/BlocksStore";
import {IAnnotationPopupActionProps} from "./IAnnotationPopupActionProps";
import {useAnnotationPopupStyles} from "./UseAnnotationPopupStyles";

const ColorPicker: React.FC<IAnnotationPopupActionProps> = (props) => {
    const { className = "", style = {}, annotation } = props;
    const { clear } = useAnnotationPopup();

    const blocksStore = useBlocksStore();
    const handleChange = React.useCallback((color: ColorStr) => {
        const annotationJSON = annotation.content.toJSON();

        blocksStore.setBlockContent(annotation.id, {
            ...annotationJSON,
            value: { ...annotationJSON.value, color }
        });
        clear();
    }, [blocksStore, annotation, clear]);

    return (
        <div className={className} style={{ ...style, width: "auto" }}>
            <ColorMenu
                selected={annotation.content.value.color}
                onChange={handleChange}
                hintLimit={ANNOTATION_COLOR_SHORTCUT_KEYS.length}
                withHints
            />
        </div>
    );
};

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            margin: "10px 0",
            transformOrigin: "bottom center",
            boxShadow: theme.shadows[8],
            width: "100%",
            zIndex: 2,
        },
    }),
);




const ACTIONS: Record<AnnotationPopupActionEnum, React.FC<IAnnotationPopupActionProps>> = {
    [AnnotationPopupActionEnum.CHANGE_COLOR]: ColorPicker,
    [AnnotationPopupActionEnum.CREATE_COMMENT]: CreateComment,
    [AnnotationPopupActionEnum.EDIT]: EditAnnotation,
    [AnnotationPopupActionEnum.CREATE_FLASHCARD]: CreateFlashcard,
    [AnnotationPopupActionEnum.CREATE_AI_FLASHCARD]: CreateAIFlashcard,
    [AnnotationPopupActionEnum.EDIT_TAGS]: EditTags,
    [AnnotationPopupActionEnum.DELETE]: DeleteAnnotation,
};

export const AnnotationPopupActions: React.FC = () => {
    const {activeAction, annotation} = useAnnotationPopup();
    const classes = useStyles();
    const annotationPopupClasses = useAnnotationPopupStyles();
    const ActionComponent = activeAction ? ACTIONS[activeAction] : null;

    if (!ActionComponent || !annotation) {
        return null;
    }

    return (
        <Grow in>
            <ActionComponent
                className={clsx(classes.root, annotationPopupClasses.root)}
                annotation={annotation}
            />
        </Grow>
    );
};
