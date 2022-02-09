import React from "react";
import {Box, createStyles, makeStyles, Paper} from "@material-ui/core";
import {observer} from "mobx-react-lite";
import {
    FABoldIcon,
    FAItalicIcon,
    FALinkIcon,
    FAStrikethroughIcon,
    FASubscriptIcon,
    FASuperscriptIcon
} from "../../icons/MUIFontAwesome";
import FormatClearIcon from '@material-ui/icons/FormatClear';
import {useBlockFormatBarStore, useNoteFormatBar} from "./NoteFormatBar";
import {LinkCreator, useNoteFormatBarActions} from "./NoteFormatBarActions";
import {NoteFormatBarActionIcon} from "./NoteFormatBarActionIcon";
import {INoteFormatBarState} from "./NoteFormatBarStore";
import {BacklinkIconButton} from "../../mui/icon_buttons/BacklinkIconButton";
import {NoteFormatPopperPositioner} from "./NoteFormatBarPositioner";
import {useBlocksStore} from "../store/BlocksStore";
import {abortEvent} from "../contenteditable/BlockKeyboardHandlers";

const useStyles = makeStyles((theme) =>
    createStyles({

        paper: {
            marginTop: theme.spacing(1)
        },
        rootInner: {
            fontSize: '2rem',
        },
        iconWrapper: {
            padding: theme.spacing(0.25),
            '& + &': {
                marginLeft: theme.spacing(1.2),
            },
        },
    })
);

interface INoteFormatBarPopperRendererProps extends INoteFormatBarState {}

const ELEVATION=10;

export const NoteFormatBarPopperDesktopRenderer: React.FC<INoteFormatBarPopperRendererProps> = observer((props) => {
    const { nonce, elem } = props;
    const classes = useStyles();
    const blockFormatBarStore = useBlockFormatBarStore();
    const { action } = blockFormatBarStore;

    const {
        handleBold,
        handleItalic,
        handleStrikeThrough,
        handleSuperscript,
        handleSubscript,
        handleRemoveFormat,
        handleActionChange,
        handleBacklink,
        handleCreateLink,
    } = useNoteFormatBarActions();

    const clearAction = React.useCallback(() => blockFormatBarStore.clearAction(), [blockFormatBarStore]);

    return (
        <NoteFormatPopperPositioner elem={elem} key={nonce}>
            <Paper elevation={ELEVATION} onMouseDown={abortEvent} className={classes.paper}>
                <Box p={0.7} display="flex" alignItems="center" className={classes.rootInner}>
                    <NoteFormatBarActionIcon icon={FABoldIcon}
                                             className={classes.iconWrapper}
                                             onClick={handleBold} />

                    <NoteFormatBarActionIcon icon={FAItalicIcon}
                                             className={classes.iconWrapper}
                                             onClick={handleItalic} />

                    <NoteFormatBarActionIcon icon={FAStrikethroughIcon}
                                             className={classes.iconWrapper}
                                             onClick={handleStrikeThrough} />

                    <NoteFormatBarActionIcon icon={FASuperscriptIcon}
                                             className={classes.iconWrapper}
                                             onClick={handleSuperscript} />

                    <NoteFormatBarActionIcon icon={FASubscriptIcon}
                                             className={classes.iconWrapper}
                                             onClick={handleSubscript} />

                    <NoteFormatBarActionIcon icon={FormatClearIcon}
                                             className={classes.iconWrapper}
                                             onClick={handleRemoveFormat} />

                    <NoteFormatBarActionIcon icon={FALinkIcon}
                                             className={classes.iconWrapper}
                                             onClick={handleActionChange('link')} />

                    <NoteFormatBarActionIcon icon={BacklinkIconButton}
                                             className={classes.iconWrapper}
                                             onClick={handleBacklink} />
                </Box>
            </Paper>
            {action && (
                <Paper elevation={ELEVATION}>
                    <Box p={0.7} mt={0.5}>
                        {action === 'link' && <LinkCreator onLink={handleCreateLink} onClose={clearAction} />}
                    </Box>
                </Paper>
            )}
        </NoteFormatPopperPositioner>
    );
});

export const NoteFormatBarPopperDesktop: React.FC = observer(() => {
    const { state } = useBlockFormatBarStore();
    const blocksStore = useBlocksStore();

    useNoteFormatBar();

    if (! state) {
        return null;
    }

    const block = blocksStore.getBlock(state.id);

    if (! block || block.readonly) {
        return null;
    }

    return <NoteFormatBarPopperDesktopRenderer {...state} />;
});
