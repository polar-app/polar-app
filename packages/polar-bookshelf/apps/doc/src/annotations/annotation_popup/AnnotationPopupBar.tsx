import React from "react";
import clsx from "clsx";
import {Box, CircularProgress, createStyles, Divider, makeStyles, useTheme} from "@material-ui/core";
import NoteIcon from "@material-ui/icons/Note";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import FlashAutoIcon from "@material-ui/icons/FlashAuto";
import CommentIcon from "@material-ui/icons/Comment";
import PaletteIcon from "@material-ui/icons/Palette";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import {StandardIconButton} from "../../../../repository/js/doc_repo/buttons/StandardIconButton";
import {MUIButtonBar} from "../../../../../web/js/mui/MUIButtonBar";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {MUIDropdownCaret} from "../../../../../web/js/mui/MUIDropdownCaret";
import {AnnotationPopupActionEnum, useAnnotationPopupStore} from "./AnnotationPopupContext";
import {useCopyAnnotation} from "./Actions/Copy";
import {useAnnotationPopupStyles} from "./UseAnnotationPopupStyles";
import {Devices} from "polar-shared/src/util/Devices";
import {reaction} from "mobx";
import {useAnnotationBlockManager} from "../../../../../web/js/notes/HighlightBlocksHooks";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {MAIN_HIGHLIGHT_COLORS} from "../../../../../web/js/ui/ColorMenu";
import {observer} from "mobx-react-lite";
import {useDeleteAnnotation} from "./Actions/DeleteAnnotation";
import {AutoClozeDeletionIcon} from "../../../../../web/js/icons/AutoClozeDeletionIcon";

const IS_HANDHELD = ! Devices.isDesktop();

export const useAnnotationPopupBarStyles = makeStyles(() =>
    createStyles({
        outer: {
            ...(IS_HANDHELD && {
                borderRadius: 0,
            }),
        },
        root: {
            width: '100%',
            ...(IS_HANDHELD && {
                justifyContent: 'space-between',
                display: 'flex',
                padding: '0 0.8rem',
            }),
        },
    })
);

export const AnnotationPopupBar: React.FC = observer(() => {
    const annotationPopupStore = useAnnotationPopupStore();
    const copyAnnotation = useCopyAnnotation();
    const theme = useTheme();
    const baseClasses = useAnnotationPopupBarStyles();
    const annotationPopupClasses = useAnnotationPopupStyles();
    const deleteAnnotation = useDeleteAnnotation();

    return (
        <Box
            boxShadow={8}
            className={clsx(annotationPopupClasses.root, annotationPopupClasses.barPadding, baseClasses.outer)}
            width="100%"
            style={{ userSelect: "none" }}
        >
            <MUIButtonBar className={baseClasses.root}>
                <Box display="flex">
                    <ColorChangerIcon
                        isOpen={annotationPopupStore.activeAction === AnnotationPopupActionEnum.CHANGE_COLOR}
                        onToggle={() => annotationPopupStore.toggleActiveAction(AnnotationPopupActionEnum.CHANGE_COLOR)}
                    />
                    <Divider orientation="vertical" flexItem style={{ marginLeft: '1rem' }} />
                </Box>
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
                    disabled={annotationPopupStore.aiFlashcardStatus === "waiting"}
                >
                    {annotationPopupStore.aiFlashcardStatus === "waiting"
                        ? <CircularProgress size={ theme.typography.pxToRem(24) } color="secondary"/>
                        : <FlashAutoIcon/>
                    }
                </ActionButton>
                <ActionButton
                    tooltip="Create cloze flashcard automatically (h)"
                    action={AnnotationPopupActionEnum.CREATE_AI_CLOZE_FLASHCARD}
                    disabled={annotationPopupStore.aiClozeFlashcardStatus === "waiting"}
                >
                    {annotationPopupStore.aiClozeFlashcardStatus === "waiting"
                        ? <CircularProgress size={ theme.typography.pxToRem(24) } color="secondary"/>
                        : <AutoClozeDeletionIcon/>
                    }
                </ActionButton>
                <ActionButton tooltip="Tag highlight (t)" action={AnnotationPopupActionEnum.EDIT_TAGS}>
                    <LocalOfferIcon />
                </ActionButton>
                <StandardIconButton
                    tooltip="Copy"
                    size="small"
                    onClick={copyAnnotation}
                >
                    <NoteIcon />
                </StandardIconButton>
                <StandardIconButton tooltip="Delete (d)" size="small" onClick={deleteAnnotation}>
                    <DeleteIcon />
                </StandardIconButton>
            </MUIButtonBar>
        </Box>
    );
});

interface IColorChangerProps {
    readonly onToggle: () => void;
    readonly isOpen: boolean;
    readonly active?: boolean;
}

const ColorChangerIcon: React.FC<IColorChangerProps> = ({ onToggle, isOpen }) => {
    const annotationPopupStore = useAnnotationPopupStore();
    const { getBlock } = useAnnotationBlockManager();

    const getColor = React.useCallback(() => {
        const { selectedAnnotationID: annotationID } = annotationPopupStore;

        if (! annotationID) {
            return MAIN_HIGHLIGHT_COLORS[0];
        }

        const annotation = getBlock(annotationID, AnnotationContentType.TEXT_HIGHLIGHT);

        if (! annotation) {
            return;
        }
        
        return annotation.content.value.color;
    }, [annotationPopupStore, getBlock]);

    const [color, setColor] = React.useState(getColor);

    React.useEffect(() => reaction(getColor, setColor), [setColor, getColor]);

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
    disabled?: boolean;
};

export const ActionButton: React.FC<IActionButtonProps> = observer((props) => {
    const {action, children, tooltip, disabled} = props;
    const annotationPopupStore = useAnnotationPopupStore();
    const theme = useTheme();

    return (
        <StandardIconButton
            tooltip={tooltip}
            size="small"
            disabled={disabled}
            style={{
                color: action === annotationPopupStore.activeAction
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
            }}
            onClick={() => annotationPopupStore.toggleActiveAction(action)}
        >
            <>{children}</>
        </StandardIconButton>
    );
});
