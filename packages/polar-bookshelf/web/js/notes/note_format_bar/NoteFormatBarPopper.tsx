import {Box, createStyles, makeStyles, Paper} from "@material-ui/core";
import {observer} from "mobx-react-lite";
import React from "react";
import {FABoldIcon, FAItalicIcon, FALinkIcon, FAStrikethroughIcon, FASubscriptIcon, FASuperscriptIcon} from "../../mui/MUIFontAwesome";
import FormatClearIcon from '@material-ui/icons/FormatClear';
import {useBlockFormatBarStore, useNoteFormatBar} from "./NoteFormatBar";
import {LinkCreator, useExecCommandExecutor} from "./NoteFormatBarActions";
import {NoteFormatBarButton} from "./NoteFormatBarButton";
import {INoteFormatBarAction, INoteFormatBarState} from "./NoteFormatBarStore";
import {useBlocksStore} from "../store/BlocksStore";
import {ContentEditables} from "../ContentEditables";
import {BacklinkIconButton} from "../../mui/icon_buttons/BacklinkIconButton";
import {useCreateBacklinkFromSelection} from "../NoteUtils";
import {NoteFormatPopperPositioner} from "./NoteFormatBarPositioner";


const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            position: 'absolute',
            zIndex: 10,
            transform: 'translateX(-50%)',
            userSelect: 'none',
        },
        icon: {
            fontSize: '22px',
            padding: theme.spacing(0.25),
        },
    })
);

interface INoteFormatBarPopperRendererProps extends INoteFormatBarState {}

export const NoteFormatBarPopperRenderer: React.FC<INoteFormatBarPopperRendererProps> = observer((props) => {
    const { nonce, elem, id } = props;
    const blockFormatBarStore = useBlockFormatBarStore();
    const { action } = blockFormatBarStore;
    const classes = useStyles();
    const handleBold = useExecCommandExecutor('bold');
    const handleItalic = useExecCommandExecutor('italic');
    const handleStrikeThrough = useExecCommandExecutor('strikeThrough');
    const handleSuperscript = useExecCommandExecutor('superscript');
    const handleSubscript = useExecCommandExecutor('subscript');
    const handleRemoveFormat = useExecCommandExecutor('removeFormat');
    const handleLink = useExecCommandExecutor('createLink');
    const createBacklinkinkFromSelection = useCreateBacklinkFromSelection();

    const handleBacklink = React.useCallback(() =>
        createBacklinkinkFromSelection(id), [createBacklinkinkFromSelection, id]);

    const handleActionChange = React.useCallback((action: INoteFormatBarAction) => {
        return () => {
            blockFormatBarStore.toggleAction(action);
            blockFormatBarStore.saveRange();
        };
    }, [blockFormatBarStore]);

    const handleCreateLink = React.useCallback((link: string) => {
        blockFormatBarStore.restoreRange();
        handleLink(link);

        const range = ContentEditables.currentRange();
        if (range) {
            range.collapse();
        }
    }, [blockFormatBarStore, handleLink]);

    const clearAction = React.useCallback(() => blockFormatBarStore.clearAction(), [blockFormatBarStore]);

    return (
        <NoteFormatPopperPositioner elem={elem} key={nonce}>
            <Paper>
                <Box p={0.7} display="flex">
                    <NoteFormatBarButton icon={<FABoldIcon className={classes.icon} />}
                                         onClick={handleBold} />

                    <NoteFormatBarButton icon={<FAItalicIcon className={classes.icon} />}
                                         onClick={handleItalic} />

                    <NoteFormatBarButton icon={<FAStrikethroughIcon className={classes.icon} />}
                                         onClick={handleStrikeThrough} />

                    <NoteFormatBarButton icon={<FASuperscriptIcon className={classes.icon} />}
                                         onClick={handleSuperscript} />

                    <NoteFormatBarButton icon={<FASubscriptIcon className={classes.icon} />}
                                         onClick={handleSubscript} />

                    <NoteFormatBarButton icon={<FormatClearIcon className={classes.icon} />}
                                         onClick={handleRemoveFormat} />

                    <NoteFormatBarButton icon={<FALinkIcon className={classes.icon} />}
                                         onClick={handleActionChange('link')} />

                    <NoteFormatBarButton icon={<BacklinkIconButton className={classes.icon} />}
                                         onClick={handleBacklink} />
                </Box>
            </Paper>
            {action && (
                <Paper>
                    <Box p={0.7} mt={0.5}>
                        {action === 'link' && <LinkCreator onLink={handleCreateLink} onClose={clearAction} />}
                    </Box>
                </Paper>
            )}
        </NoteFormatPopperPositioner>
    );
});

export const NoteFormatBarPopper: React.FC = observer(() => {
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

    return <NoteFormatBarPopperRenderer {...state} />;
});
