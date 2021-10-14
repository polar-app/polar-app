import {Button, createStyles, Divider, makeStyles} from '@material-ui/core';
import React from 'react';
import {CreateNote} from './toolbar/CreateNote';
import {SearchForNote} from "./toolbar/SearchForNote";
import {NotesRepoButton} from './toolbar/NotesRepoButton';
import {SidenavTriggerIconButton} from '../sidenav/SidenavTriggerIconButton';
import {NEW_NOTES_ANNOTATION_BAR_ENABLED} from '../../../apps/doc/src/DocViewer';
import {useBlocksStore} from './store/BlocksStore';
import {useDialogManager} from '../mui/dialogs/MUIDialogControllers';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flex: '0 0 55px',
            height: 55,
            padding: '0 26px',
        },
        divider: {
            padding: '0 26px',
        },
        left: {
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
        },
        right: {
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
        },
        mid: {
            flex: '0 1 522px',
            maxWidth: 522,
            margin: '0 20px',
        }
    }),
);

export const NotesToolbar = () => {
    const classes = useStyles();
    const blocksStore = useBlocksStore();
    const dialogs = useDialogManager();

    const handlePurgeDocumentNotes = React.useCallback(() => {
        const documentBlockIDs = Object.values(blocksStore.indexByDocumentID);
        if (documentBlockIDs.length) {
            blocksStore.deleteBlocks(documentBlockIDs);
            dialogs.snackbar({
                message: `Deleting a total of ${documentBlockIDs.length} document blocks!`,
                type: 'success',
            });
        } else {
            dialogs.snackbar({
                message: `No document blocks were found!`,
                type: 'error',
            });
        }
    }, [blocksStore, dialogs]);

    return (
        <>
            <div className={classes.root}>
                <div className={classes.left}>
                    <SidenavTriggerIconButton />
                    <NotesRepoButton />
                    {NEW_NOTES_ANNOTATION_BAR_ENABLED && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            style={{ height: 38, marginLeft: 10 }}
                            disableElevation
                            onClick={handlePurgeDocumentNotes}
                        >
                            Purge document blocks
                        </Button>
                    )}
                </div>
                <div className={classes.mid}><SearchForNote /></div>
                <div className={classes.right}><CreateNote /></div>
            </div>
            <div className={classes.divider}><Divider /></div>
        </>
    )
};
