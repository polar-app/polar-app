import React from 'react';
import {NotesRepoStoreProvider} from './NotesRepoStore';
import {NotesRepoTable2} from './NotesRepoTable2';

export const NotesRepoScreen2 = React.memo(function NotesRepoScreen2() {
    return (
        <NotesRepoStoreProvider>
            <NotesRepoTable2/>
        </NotesRepoStoreProvider>
    )
})
