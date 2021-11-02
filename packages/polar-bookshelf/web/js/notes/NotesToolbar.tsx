import {Button, createStyles, Divider, IconButton, makeStyles, Tooltip} from '@material-ui/core';
import React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {SearchForNote, SearchForNoteHandheld} from "./toolbar/SearchForNote";
import {SidenavTriggerIconButton} from '../sidenav/SidenavTriggerIconButton';
import {NEW_NOTES_ANNOTATION_BAR_ENABLED} from '../../../apps/doc/src/DocViewer';
import {useBlocksStore} from './store/BlocksStore';
import {useDialogManager} from '../mui/dialogs/MUIDialogControllers';
import {MUIMenu} from '../mui/menu/MUIMenu';
import {MUIMenuItem} from '../mui/menu/MUIMenuItem';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import BorderAllIcon from '@material-ui/icons/BorderAll';
import {useHistory} from "react-router";
import {RoutePathNames} from "../apps/repository/RoutePathNames";
import {NameContent} from "./content/NameContent";
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {DeviceRouters} from '../ui/DeviceRouter';

export const useCreateNoteDialog = () => {
    const dialogs = useDialogManager();
    const history = useHistory();
    const blocksStore = useBlocksStore();

    return React.useCallback(() => {
        dialogs.prompt({
            title: "Create new named note",
            autoFocus: true,
            onCancel: NULL_FUNCTION,
            onDone: (text) => {
                const content = new NameContent({
                    type: 'name',
                    data: text,
                    links: [],
                });
                const id = blocksStore.createNewNamedBlock({ content });
                history.push(RoutePathNames.NOTE(id));
            }
        });
    }, [dialogs, history, blocksStore]);
};


export const useHandlePurgeDocumentBlocks = () => {
    const blocksStore = useBlocksStore();
    const dialogs = useDialogManager();

    return React.useCallback(() => {
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
};

const useDesktopStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flex: '0 0 55px',
            height: 55,
            padding: '0 26px',
            background: theme.palette.background.paper
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
            flex: 1,
            maxWidth: 340,
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

const DesktopNotesToolbar = () => {
    const classes = useDesktopStyles();
    const handlePurgeDocumentNotes = useHandlePurgeDocumentBlocks();
    const handleCreateNote = useCreateNoteDialog();

    return (
        <>
            <div className={classes.root}>
                <div className={classes.left}>
                    <Button color="primary"
                            style={{ height: 38 }}
                            variant="contained"
                            disableElevation
                            startIcon={<AddCircleOutlineIcon style={{ fontSize: 24 }} />}
                            onClick={handleCreateNote}
                            size="medium">
                        Create a new note
                    </Button>
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
                <div className={classes.right}>
                    <SearchForNote />
                </div>
            </div>
            {/* <div className={classes.divider}><Divider /></div> */}
        </>
    );
};

const useHandHeldStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flex: '0 0 55px',
            height: 55,
            padding: '0 14px',
            background: theme.palette.background.paper
        },
        divider: {
            padding: '0 14px',
        },
    }),
);

const HandheldNotesToolbar = () => {
    const classes = useHandHeldStyles();
    const createNoteDialog = useCreateNoteDialog();
    const history = useHistory();

    const handlePurgeDocumentNotes = useHandlePurgeDocumentBlocks();

    const handleDailyNotesNavigation = React.useCallback(() =>
        history.push(RoutePathNames.DAILY), [history]);

    return (
        <>
            <div className={classes.root}>
                <div>
                    <SidenavTriggerIconButton />
                    <Tooltip title="Daily Notes">
                        <IconButton size="small" onClick={handleDailyNotesNavigation}>
                            <BorderAllIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <div>
                    <SearchForNoteHandheld />
                    <MUIMenu button={{ icon: <MoreVertIcon/>, size: 'small' }}>
                        <div>
                            <MUIMenuItem text="Create Note"
                                         icon={<AddCircleOutlineIcon />}
                                         onClick={createNoteDialog} />
                            {NEW_NOTES_ANNOTATION_BAR_ENABLED && (
                                <MUIMenuItem text="Purge Document Blocks"
                                             icon={<DeleteIcon />}
                                             onClick={handlePurgeDocumentNotes} />
                            )}
                        </div>
                    </MUIMenu>
                </div>
            </div>
            <div className={classes.divider}><Divider /></div>
        </>
    )
};

export const NotesToolbar = () => {
    return (
        <>
            <DeviceRouters.Handheld><HandheldNotesToolbar /></DeviceRouters.Handheld>
            <DeviceRouters.Desktop><DesktopNotesToolbar /></DeviceRouters.Desktop>
        </>
    );
};
