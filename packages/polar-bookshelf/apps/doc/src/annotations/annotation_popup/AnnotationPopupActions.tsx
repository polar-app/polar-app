import React from "react";
import clsx from "clsx";
import {createStyles, Grow, makeStyles} from "@material-ui/core";
import {useAnnotationPopupStyles} from "./AnnotationPopup";
import {AnnotationPopupActionEnum, useAnnotationPopup} from "./AnnotationPopupContext";
import {useAnnotationMutationsContext} from "../../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {ColorMenu} from "../../../../../web/js/ui/ColorMenu";
import {ColorStr} from "../../../../../web/js/ui/colors/ColorSelectorBox";
import {EditAnnotation} from "./Actions/EditAnnotation";
import {CreateComment} from "./Actions/CreateComment";
import {CreateFlashcard} from "./Actions/CreateFlashcard";
import {IDocAnnotation} from "../../../../../web/js/annotation_sidebar/DocAnnotation";
import {CopyAnnotation} from "./Actions/CopyAnnotation";
import {CreateAIFlashcard} from "./Actions/CreateAIFlashcard";
import {EditTags} from "./Actions/EditTags";
import {DeleteAnnotation} from "./Actions/DeleteAnnotation";


export type IAnnotationPopupActionProps = {
    className?: string;
    style?: React.CSSProperties;
    annotation: IDocAnnotation;
};

const ColorPicker: React.FC<IAnnotationPopupActionProps> = (props) => {
    const {className = "", style = {}, annotation} = props;
    const {clear} = useAnnotationPopup();
    const annotationMutations = useAnnotationMutationsContext();

    const handleColor = annotationMutations.createColorCallback({selected: [annotation]});
    const handleChange = (color: ColorStr) => {
        handleColor({ color });
        clear();
    };

    return (
        <div className={className} style={{ ...style, width: "auto" }}>
            <ColorMenu selected={annotation.color} onChange={handleChange} />
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
    [AnnotationPopupActionEnum.COPY]: CopyAnnotation,
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
