import React from 'react';
import {NotesRepoTable2, TableGridStoreProvider} from './NotesRepoTable2';

export const NotesRepoScreen2 = React.memo(function NotesRepoScreen2() {
    return (
        <TableGridStoreProvider>
            <>
                <NotesRepoTable2/>
            </>
        </TableGridStoreProvider>
    )
})
