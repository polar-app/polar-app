import React from "react";
import clsx from "clsx";
import {Box, CircularProgress, Divider, useTheme} from "@material-ui/core";
import {IDocAnnotation} from "../../../../../web/js/annotation_sidebar/DocAnnotation";
import NoteIcon from "@material-ui/icons/Note";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import EditIcon from "@material-ui/icons/Edit";
import FlashAutoIcon from "@material-ui/icons/FlashAuto";
import CommentIcon from "@material-ui/icons/Comment";
import PaletteIcon from "@material-ui/icons/Palette";
import {StandardIconButton} from "../../../../repository/js/doc_repo/buttons/StandardIconButton";
import {MUIButtonBar} from "../../../../../web/js/mui/MUIButtonBar";
import {MUIDocDeleteButton} from "../../../../repository/js/doc_repo/buttons/MUIDocDeleteButton";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {useAnnotationMutationsContext} from "../../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {MUIDropdownCaret} from "../../../../../web/js/mui/MUIDropdownCaret";
import {useAnnotationPopupStyles} from "./AnnotationPopup";
import {AnnotationPopupActionEnum, useAnnotationPopupAction} from "./AnnotationPopupActionContext";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";


type IActionButtonProps = {
    action: AnnotationPopupActionEnum;
    tooltip: string;
};

export const ActionButton: React.FC<IActionButtonProps> = (props) => {
    const {action, children, tooltip} = props;
    const {activeAction, toggleAction} = useAnnotationPopupAction();
    const theme = useTheme();

    return (
        <StandardIconButton
            tooltip={tooltip}
            size="small"
            color="primary"
            style={{
                color: action === activeAction
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
            }}
            onClick={toggleAction(action)}
        >
            <>{children}</>
        </StandardIconButton>
    );
};

export const AnnotationPopupBar: React.FC = () => {
    const {activeAction, toggleAction, annotation} = useAnnotationPopupAction();
    const theme = useTheme();

    const annotationPopupClasses = useAnnotationPopupStyles();

    return (
        <Box
            boxShadow={8}
            display="flex"
            className={clsx(annotationPopupClasses.root, annotationPopupClasses.barPadding)}
            style={{ userSelect: "none" }}
        >
            <MUIButtonBar>
                <ColorChanger
                    annotation={annotation}
                    isOpen={activeAction === AnnotationPopupActionEnum.CHANGE_COLOR}
                    onToggle={toggleAction(AnnotationPopupActionEnum.CHANGE_COLOR)}
                />
                <Divider orientation="vertical" flexItem />
                <ActionButton tooltip="Edit highlight" action={AnnotationPopupActionEnum.EDIT}>
                    <EditIcon />
                </ActionButton>
                <ActionButton tooltip="Comment" action={AnnotationPopupActionEnum.CREATE_COMMENT}>
                    <CommentIcon />
                </ActionButton>
                <ActionButton
                    tooltip="Create flashcard manually"
                    action={AnnotationPopupActionEnum.CREATE_FLASHCARD}
                >
                    <FlashOnIcon />
                </ActionButton>
                <ActionButton
                    tooltip="Create flashcard automatically"
                    action={AnnotationPopupActionEnum.CREATE_AI_FLASHCARD}
                >
                    {activeAction === AnnotationPopupActionEnum.CREATE_AI_FLASHCARD
                        ? <CircularProgress size={ theme.typography.pxToRem(24) } color="secondary"/>
                        : <FlashAutoIcon/>
                    }
                </ActionButton>
                <ActionButton tooltip="Tag highlight" action={AnnotationPopupActionEnum.EDIT_TAGS}>
                    <LocalOfferIcon />
                </ActionButton>
                <Divider orientation="vertical" flexItem />
                <ActionButton tooltip="Copy" action={AnnotationPopupActionEnum.COPY}>
                    <NoteIcon />
                </ActionButton>
                {annotation && <DeleteButton annotation={annotation} />}
            </MUIButtonBar>
        </Box>
    );
};

type IDeleteButtonProps = {
    annotation: IDocAnnotation;
};

const DeleteButton: React.FC<IDeleteButtonProps> = ({ annotation }) => {
    const annotationMutations = useAnnotationMutationsContext();
    const handleDelete = annotationMutations.createDeletedCallback({selected: [annotation]});

    return <MUIDocDeleteButton onClick={handleDelete} />;
};

type IColorChangerProps = {
    onToggle: () => void;
    isOpen: boolean;
    annotation?: IDocAnnotation;
    active?: boolean;
}

const ColorChanger: React.FC<IColorChangerProps> = ({ onToggle, isOpen, annotation }) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            flexWrap="nowrap"
            style={{ cursor: "pointer" }}
            onClick={onToggle}
        >
            <StandardIconButton
                tooltip="Change color"
                size="small"
                color="primary"
                onClick={NULL_FUNCTION}
            >
                <PaletteIcon style={annotation ? { color: annotation.color } : {}} />
            </StandardIconButton>
            <MUIDropdownCaret style={{ transform: `rotate(${isOpen ? 0 : Math.PI}rad)` }} />
        </Box>
    );
};
