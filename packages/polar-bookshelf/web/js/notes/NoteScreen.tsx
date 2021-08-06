import * as React from 'react';
import {Route, RouteComponentProps, Switch} from 'react-router-dom';
import {LinearProgress} from '@material-ui/core';
import {useBlocksStore} from './store/BlocksStore';
import {JumpToNoteKeyboardCommand} from './JumpToNoteKeyboardCommand';
import {observer} from 'mobx-react-lite';
import {NotesContainer} from './NotesContainer';
import {MUIBrowserLinkStyle} from "../mui/MUIBrowserLinkStyle";
import {NoteStyle} from "./NoteStyle";
import {NoteSelectionHandler} from "./NoteSelectionHandler";
import {ActionMenuPopup} from "../mui/action_menu/ActionMenuPopup";
import {ActionMenuStoreProvider} from "../mui/action_menu/ActionStore";
import {NotesToolbar} from "./NotesToolbar";
import {createStyles, makeStyles} from "@material-ui/core";
import {NoteRepoScreen} from './NoteRepoScreen';
import {DailyNotesScreen} from './DailyNotesScreen';
import {SingleNoteScreen} from './SingleNoteScreen';

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
        <ActionMenuStoreProvider>
            <NoteSelectionHandler style={{ height: '100%' }}>
                <NoteStyle>
                    <MUIBrowserLinkStyle className={classes.noteOuter}>
                        <NotesToolbar />
                        {children}
                        <ActionMenuPopup />
                    </MUIBrowserLinkStyle>
                </NoteStyle>
            </NoteSelectionHandler>
        </ActionMenuStoreProvider>
    );
};

export const NotesScreen: React.FC<RouteComponentProps> = observer(() => {
    const blocksStore = useBlocksStore();

    if (! blocksStore.hasSnapshot) {
        return (
            <LinearProgress />
        );
    }

    return (
        <NotesContainer>
            <NoteProviders>
                <JumpToNoteKeyboardCommand />
                <Switch>
                    <Route path="/notes/repo" component={NoteRepoScreen} />
                    <Route path="/notes/:id" component={SingleNoteScreen} />
                    <Route path="/notes" component={DailyNotesScreen} />
                </Switch>
            </NoteProviders>
        </NotesContainer>
    );

});
