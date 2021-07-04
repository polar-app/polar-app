import * as React from 'react';
import {Route, RouteComponentProps, Switch} from 'react-router-dom';
import {NoteRoot} from "./NoteRoot";
import {LinearProgress} from '@material-ui/core';
import {useBlocksStore} from './store/BlocksStore';
import {JumpToNoteKeyboardCommand} from './JumpToNoteKeyboardCommand';
import {observer} from 'mobx-react-lite';
import {NotesContainer} from './NotesContainer';

export const NotesScreen: React.FC<RouteComponentProps> = observer(() => {
    const blocksStore = useBlocksStore();

    if (! blocksStore.hasSnapshot) {
        return (
            <LinearProgress />
        );
    }

    return (
        <NotesContainer>
            <JumpToNoteKeyboardCommand />
            <Switch>
                <Route path="/notes/:id" component={NoteRoot} />
                <Route path="/notes" component={NoteRoot} />
            </Switch>
        </NotesContainer>
    );

});
