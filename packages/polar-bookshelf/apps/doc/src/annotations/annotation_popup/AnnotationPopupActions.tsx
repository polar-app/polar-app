import React from "react";
import clsx from "clsx";
import {createStyles, Grow, makeStyles} from "@material-ui/core";
import {AnnotationPopupActionEnum, useAnnotationPopupStore} from "./AnnotationPopupContext";
import {EditAnnotation} from "./Actions/EditAnnotation";
import {CreateComment} from "./Actions/CreateComment";
import {CreateFlashcard} from "./Actions/CreateFlashcard";
import {CreateAIFlashcard} from "./Actions/CreateAIFlashcard";
import {EditTags} from "./Actions/EditTags";
import {IAnnotationPopupActionProps} from "./IAnnotationPopupActionProps";
import {useAnnotationPopupStyles} from "./UseAnnotationPopupStyles";
import {ColorPicker} from "./Actions/ColorPicker";
import {observer} from "mobx-react-lite";

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
};

export const AnnotationPopupActions: React.FC = observer(() => {
    const { selectedAnnotationID, activeAction } = useAnnotationPopupStore();
    const classes = useStyles();
    const annotationPopupClasses = useAnnotationPopupStyles();
    const ActionComponent = activeAction ? ACTIONS[activeAction] : null;

    if (! ActionComponent || ! selectedAnnotationID) {
        return null;
    }

    return (
        <Grow in>
            <ActionComponent
                className={clsx(classes.root, annotationPopupClasses.root)}
                annotationID={selectedAnnotationID}
            />
        </Grow>
    );
});
