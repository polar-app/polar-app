import * as React from 'react';
import {Route, Switch} from 'react-router-dom';
import {Box, createStyles, LinearProgress, makeStyles} from '@material-ui/core';
import {useBlocksStore} from './store/BlocksStore';
import {observer} from 'mobx-react-lite';
import {NotesContainer} from './NotesContainer';
import {MUIBrowserLinkStyle} from "../mui/MUIBrowserLinkStyle";
import {NoteStyle} from "./NoteStyle";
import {NoteSelectionHandler} from "./NoteSelectionHandler";
import {ActionMenuPopup} from "../mui/action_menu/ActionMenuPopup";
import {ActionMenuStoreProvider} from "../mui/action_menu/ActionStore";
import {DailyNotesScreen} from './DailyNotesScreen';
import {SingleNoteScreen} from './SingleNoteScreen';
import {RoutePathNames} from '../apps/repository/RoutePathNames';
import {NotesRepoScreen} from "./NotesRepoScreen";
import {DeviceRouters} from '../ui/DeviceRouter';
import {NotesRepoScreen2} from "../../../apps/repository/js/notes_repo/NotesRepoScreen2";
import {BlockOverflowMenuProvider} from './block_overflow_menu/BlockOverflowMenu';
import {BlockFormatBarProvider} from './note_format_bar/NoteFormatBar';

const useStyles = makeStyles(() =>
    createStyles({
        noteOuter: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            height: '100%',
        },
    }),
);


export const NoteProviders: React.FC = ({ children }) => {
    const classes = useStyles();

    return (
        <Box className="NoteRoot"
             style={{ height: '100%', width: '100%' }}
             display="flex"
             flexDirection="column">

            <BlockFormatBarProvider>
                <BlockOverflowMenuProvider>
                    <ActionMenuStoreProvider>
                        <NoteSelectionHandler style={{ flex: 1, minHeight: 0 }}>
                            <NoteStyle>
                                <MUIBrowserLinkStyle className={classes.noteOuter}>
                                    {children}
                                    <ActionMenuPopup />
                                </MUIBrowserLinkStyle>
                            </NoteStyle>
                        </NoteSelectionHandler>
                    </ActionMenuStoreProvider>
                </BlockOverflowMenuProvider>
            </BlockFormatBarProvider>

        </Box>
    );
};

export const NotesScreen: React.FC = observer(() => {

    const blocksStore = useBlocksStore();

    if (! blocksStore.hasSnapshot) {
        return (
            <LinearProgress />
        );
    }

    return (
        <NotesContainer>
            <NoteProviders>
                <Switch>
                    <Route path={RoutePathNames.NOTE(":id")} component={SingleNoteScreen} />
                    <Route path={RoutePathNames.DAILY} component={DailyNotesScreen} />

                    <DeviceRouters.Desktop>
                        <Route path={RoutePathNames.NOTES} component={NotesRepoScreen} />
                    </DeviceRouters.Desktop>

                    <DeviceRouters.NotDesktop>
                        <Route path={RoutePathNames.NOTES} component={NotesRepoScreen2} />
                    </DeviceRouters.NotDesktop>

                </Switch>
            </NoteProviders>
        </NotesContainer>
    );

});
