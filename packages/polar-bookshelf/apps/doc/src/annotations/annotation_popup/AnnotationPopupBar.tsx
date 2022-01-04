import React from "react";
import clsx from "clsx";
import {Box, CircularProgress, Divider, useTheme} from "@material-ui/core";
import NoteIcon from "@material-ui/icons/Note";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import FlashAutoIcon from "@material-ui/icons/FlashAuto";
import CommentIcon from "@material-ui/icons/Comment";
import PaletteIcon from "@material-ui/icons/Palette";
import {StandardIconButton} from "../../../../repository/js/doc_repo/buttons/StandardIconButton";
import {MUIButtonBar} from "../../../../../web/js/mui/MUIButtonBar";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {MUIDropdownCaret} from "../../../../../web/js/mui/MUIDropdownCaret";
import {AnnotationPopupActionEnum, useAnnotationPopup} from "./AnnotationPopupContext";
import {SelectedContents} from "../../../../../web/js/highlights/text/selection/SelectedContents";
import {useDocViewerContext} from "../../renderers/DocRenderer";
import {Clipboards} from "../../../../../web/js/util/system/clipboard/Clipboards";
import {BlockTextHighlights} from "polar-blocks/src/annotations/BlockTextHighlights";
import {useAnnotationPopupStyles} from "./UseAnnotationPopupStyles";

export const useCopyAnnotation = () => {
    const {annotation, selectionEvent} = useAnnotationPopup();
    const {fileType} = useDocViewerContext();

    return React.useCallback(() => {
        if (annotation) {
            Clipboards.writeText(BlockTextHighlights.toText(annotation.content.value));
        } else if (selectionEvent) {
            const selectedContent = SelectedContents.computeFromSelection(selectionEvent.selection, {
                noRectTexts: fileType === "epub",
                fileType,
            });
            Clipboards.writeText(selectedContent.text);
        }
    }, [selectionEvent, fileType, annotation]);
};

export const AnnotationPopupBar: React.FC = () => {
    const {activeAction, toggleAction, annotation, aiFlashcardStatus} = useAnnotationPopup();
    const copyAnnotation = useCopyAnnotation();
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
                    isOpen={activeAction === AnnotationPopupActionEnum.CHANGE_COLOR}
                    onToggle={toggleAction(AnnotationPopupActionEnum.CHANGE_COLOR)}
                />
                <Divider orientation="vertical" flexItem />
                <ActionButton tooltip="Edit highlight (e)" action={AnnotationPopupActionEnum.EDIT}>
                    <EditIcon />
                </ActionButton>
                <ActionButton tooltip="Comment (c)" action={AnnotationPopupActionEnum.CREATE_COMMENT}>
                    <CommentIcon />
                </ActionButton>
                <ActionButton
                    tooltip="Create flashcard manually (f)"
                    action={AnnotationPopupActionEnum.CREATE_FLASHCARD}
                >
                    <FlashOnIcon />
                </ActionButton>
                <ActionButton
                    tooltip="Create flashcard automatically (g)"
                    action={AnnotationPopupActionEnum.CREATE_AI_FLASHCARD}
                >
                    {aiFlashcardStatus === "waiting"
                        ? <CircularProgress size={ theme.typography.pxToRem(24) } color="secondary"/>
                        : <FlashAutoIcon/>
                    }
                </ActionButton>
                {/*<ActionButton tooltip="Tag highlight (t)" action={AnnotationPopupActionEnum.EDIT_TAGS}>*/}
                {/*    <LocalOfferIcon />*/}
                {/*</ActionButton>*/}
                <Divider orientation="vertical" flexItem />
                <StandardIconButton
                    tooltip="Copy"
                    size="small"
                    onClick={copyAnnotation}
                >
                    <NoteIcon />
                </StandardIconButton>
                {annotation && (
                    <ActionButton tooltip="Delete (d)" action={AnnotationPopupActionEnum.DELETE}>
                        <DeleteIcon/>
                    </ActionButton>
                )}
            </MUIButtonBar>
        </Box>
    );
};

type IColorChangerProps = {
    onToggle: () => void;
    isOpen: boolean;
    active?: boolean;
}

const ColorChanger: React.FC<IColorChangerProps> = ({ onToggle, isOpen }) => {
    const { annotation } = useAnnotationPopup();

    const color = React.useMemo<string | undefined>(() => {
        if (! annotation) {
            return undefined;
        }

        return annotation.content.value.color;
    }, [annotation]);

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
                onClick={NULL_FUNCTION}
            >
                <PaletteIcon style={color ? { color } : {}} />
            </StandardIconButton>
            <MUIDropdownCaret style={{ transform: `rotate(${isOpen ? 0 : Math.PI}rad)` }} />
        </Box>
    );
};


type IActionButtonProps = {
    action: AnnotationPopupActionEnum;
    tooltip: string;
};

export const ActionButton: React.FC<IActionButtonProps> = (props) => {
    const {action, children, tooltip} = props;
    const {activeAction, toggleAction} = useAnnotationPopup();
    const theme = useTheme();

    return (
        <StandardIconButton
            tooltip={tooltip}
            size="small"
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
