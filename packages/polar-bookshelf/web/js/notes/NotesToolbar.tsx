import {AppBar, Box, createStyles, makeStyles, Toolbar} from '@material-ui/core';
import React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {SearchForNote} from "./toolbar/SearchForNote";
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
import {NotesHistoryBreadcrumbsUsingHistory} from "./NotesHistoryBreadcrumbs";
import {FeatureEnabled} from '../features/FeaturesRegistry';
import {CreateNoteButton} from './toolbar/CreateNoteButton';

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

const useDesktopStyles = makeStyles(() =>
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

    return (
        <RepositoryToolbar className={classes.root}>
            <Box px={1} py={1} className={classes.left}>
                <CreateNoteButton />
            </Box>
            <Box px={1} py={1} className={classes.right}>
                <SearchForNote />
            </Box>
        </RepositoryToolbar>
    );
};

const useHandheldStyles = makeStyles((theme) =>
    createStyles({
        root: {
            padding: theme.spacing(1.4),
        },
    }),
);

const HandheldNotesToolbar = React.memo(function HandheldNotesToolbar() {
    const createNoteDialog = useCreateNoteDialog();
    const history = useHistory();
    const classes = useHandheldStyles();

    return (
        <>
            <AppBar color="inherit" position="static">
                <Toolbar classes={{ gutters: classes.root }}>
                    <div>
                        <StandardIconButton tooltip="Back to notes"
                                            onClick={() => history.push("/notes")}>
                            <NotesIcon fontSize="small" />
                        </StandardIconButton>
                    </div>

                    <FeatureEnabled feature='new-notes-handheld-breadcrumbs'>
                        <NotesHistoryBreadcrumbsUsingHistory/>
                    </FeatureEnabled>

                    <div style={{marginLeft: 'auto'}}>
                        {/*<SearchForNoteHandheld />*/}
                        <MUIMenu button={{ icon: <MoreVertIcon/>, size: 'small' }}>
                            <div>
                                <MUIMenuItem text="Create Note"
                                             icon={<AddCircleOutlineIcon />}
                                             onClick={createNoteDialog} />
                            </div>
                        </MUIMenu>
                    </div>
                </Toolbar>
            </AppBar>
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
