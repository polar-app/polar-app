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
import {SideCar} from '../sidenav/SideNav';
import { RoutePathnames } from '../apps/repository/RoutePathnames';

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
                <SideCar>
                    <div>Empty for now</div>
                </SideCar>
                <JumpToNoteKeyboardCommand />
                <Switch>
                    <Route path={RoutePathnames.NOTES_REPO} component={NoteRepoScreen} />
                    <Route path={RoutePathnames.NOTE(":id")} component={SingleNoteScreen} />
                    <Route path={RoutePathnames.NOTES} component={DailyNotesScreen} />
                </Switch>
            </NoteProviders>
        </NotesContainer>
    );

});
