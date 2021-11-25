import React from 'react';
import {NotesRepoTable2} from './NotesRepoTable2';
import {TableGridStoreProvider} from './TableGridStore';

export const NotesRepoScreen2 = React.memo(function NotesRepoScreen2() {
    return (
        <TableGridStoreProvider>
            <NotesRepoTable2/>
        </TableGridStoreProvider>
    )
})
