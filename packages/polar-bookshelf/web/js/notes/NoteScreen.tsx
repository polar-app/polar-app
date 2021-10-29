import * as React from 'react';
import {Route, Switch} from 'react-router-dom';
import {createStyles, LinearProgress, makeStyles} from '@material-ui/core';
import {useBlocksStore} from './store/BlocksStore';
import {observer} from 'mobx-react-lite';
import {NotesContainer} from './NotesContainer';
import {MUIBrowserLinkStyle} from "../mui/MUIBrowserLinkStyle";
import {NoteStyle} from "./NoteStyle";
import {NoteSelectionHandler} from "./NoteSelectionHandler";
import {ActionMenuPopup} from "../mui/action_menu/ActionMenuPopup";
import {ActionMenuStoreProvider} from "../mui/action_menu/ActionStore";
import {NotesRepoScreen} from './NotesRepoScreen';
import {DailyNotesScreen} from './DailyNotesScreen';
import {SingleNoteScreen} from './SingleNoteScreen';
import {SideCar} from '../sidenav/SideNav';
import {RoutePathNames} from '../apps/repository/RoutePathNames';

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
        <div className="NoteRoot" style={{ height: '100%', width: '100%' }}>
            <ActionMenuStoreProvider>
                <NoteSelectionHandler style={{ height: '100%' }}>
                    <NoteStyle>
                        <MUIBrowserLinkStyle className={classes.noteOuter}>
                            {children}
                            <ActionMenuPopup />
                        </MUIBrowserLinkStyle>
                    </NoteStyle>
                </NoteSelectionHandler>
            </ActionMenuStoreProvider>
        </div>
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
                <SideCar>
                    <div style={{ padding: 12 }}>Empty for now</div>
                </SideCar>
                <Switch>
                    <Route path={RoutePathNames.NOTES} component={NotesRepoScreen} />
                    <Route path={RoutePathNames.NOTE(":id")} component={SingleNoteScreen} />
                    <Route path={RoutePathNames.DAILY} component={DailyNotesScreen} />
                </Switch>
            </NoteProviders>
        </NotesContainer>
    );

});
