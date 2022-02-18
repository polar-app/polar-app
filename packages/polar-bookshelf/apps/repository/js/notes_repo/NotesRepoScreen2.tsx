import React from 'react';
import {NotesRepoTable2, TableGridStoreProvider} from './NotesRepoTable2';
import {DeviceRouters} from '../../../../web/js/ui/DeviceRouter';
import {MobileDailyNotesFab} from "./MobileDailyNotesFab";
import {NotesToolbar} from "../../../../web/js/notes/NotesToolbar";

export const NotesRepoScreen2 = React.memo(function NotesRepoScreen2() {

    return (
        <TableGridStoreProvider>
            <>

                <NotesToolbar/>

                <NotesRepoTable2/>

                <DeviceRouters.NotDesktop>
                    <MobileDailyNotesFab/>
                </DeviceRouters.NotDesktop>
            </>
        </TableGridStoreProvider>
    )
})

