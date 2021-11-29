import {Box, Button, createStyles, makeStyles} from '@material-ui/core';
import React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {SearchForNote, SearchForNoteHandheld} from "./toolbar/SearchForNote";
import {useBlocksStore} from './store/BlocksStore';
import {useDialogManager} from '../mui/dialogs/MUIDialogControllers';
import {MUIMenu} from '../mui/menu/MUIMenu';
import {MUIMenuItem} from '../mui/menu/MUIMenuItem';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import {useHistory} from "react-router";
import {RoutePathNames} from "../apps/repository/RoutePathNames";
import {NameContent} from "./content/NameContent";
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {DeviceRouters} from '../ui/DeviceRouter';
import {DateContent} from './content/DateContent';
import moment from 'moment';
import {RepositoryToolbar} from '../apps/repository/RepositoryToolbar';
import NotesIcon from "@material-ui/icons/Notes";
import {StandardIconButton} from "../../../apps/repository/js/doc_repo/buttons/StandardIconButton";

export const useCreateNoteDialog = () => {
    const dialogs = useDialogManager();
    const history = useHistory();
    const blocksStore = useBlocksStore();

    return React.useCallback(() => {
        const getContent = (text: string) => {
            const date = moment(text);

            if (date.isValid()) {
                return new DateContent({
                    type: 'date',
                    format: 'YYYY-MM-DD',
                    data: date.format('YYYY-MM-DD'),
                    links: [],
                });
            }

            return new NameContent({ type: 'name', data: text, links: [] });
        };

        dialogs.prompt({
            title: "Create new named note",
            autoFocus: true,
            onCancel: NULL_FUNCTION,
            onDone: (text) => {
                const id = blocksStore.createNewNamedBlock({ content: getContent(text) });
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
            alignItems: 'center'
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
        }
    }),
);

const DesktopNotesToolbar = () => {
    const classes = useDesktopStyles();
    const handleCreateNote = useCreateNoteDialog();

    return (
        <RepositoryToolbar className={classes.root}>
            <Box px={1} py={1} className={classes.left}>
                <Button color="primary"
                        style={{ height: 38, width: 284 }}
                        variant="contained"
                        disableElevation
                        startIcon={<AddCircleOutlineIcon style={{ fontSize: 24 }} />}
                        onClick={handleCreateNote}
                        size="medium">
                    Create a new note
                </Button>
            </Box>
            <Box px={1} py={1} className={classes.right}>
                <SearchForNote />
            </Box>
        </RepositoryToolbar>
    );
};

const useHandHeldStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flex: '0 0 50px',
            height: 50,
            padding: '0 14px',
            background: theme.palette.background.paper
        }
    }),
);

const HandheldNotesToolbar = React.memo(function HandheldNotesToolbar() {
    const classes = useHandHeldStyles();
    const createNoteDialog = useCreateNoteDialog();
    const history = useHistory();

    return (
        <>
            <div className={classes.root}>
                <div>
                    <StandardIconButton tooltip="Back to notes"
                                        onClick={() => history.push("/notes")}>
                        <NotesIcon />
                    </StandardIconButton>
                </div>
                <div>
                    <SearchForNoteHandheld />
                    <MUIMenu button={{ icon: <MoreVertIcon/>, size: 'small' }}>
                        <div>
                            <MUIMenuItem text="Create Note"
                                         icon={<AddCircleOutlineIcon />}
                                         onClick={createNoteDialog} />
                        </div>
                    </MUIMenu>
                </div>
            </div>
        </>
    )
});

export const NotesToolbar = React.memo(function NotesToolbar() {
    return (
        <>
            <DeviceRouters.Handheld><HandheldNotesToolbar /></DeviceRouters.Handheld>
            <DeviceRouters.Desktop><DesktopNotesToolbar /></DeviceRouters.Desktop>
        </>
    );
});
