import React from 'react';
import {NotesRepoTable2, TableGridStoreProvider} from './NotesRepoTable2';
import {DeviceRouters} from '../../../../web/js/ui/DeviceRouter';
import {MobileDailyNotesFab} from "./MobileDailyNotesFab";

export const NotesRepoScreen2 = React.memo(function NotesRepoScreen2() {

    return (
        <TableGridStoreProvider>
            <div className={'notes-listing'}>
                <NotesRepoTable2/>

                <DeviceRouters.NotDesktop>
                    <MobileDailyNotesFab/>
                </DeviceRouters.NotDesktop>
            </div>
        </TableGridStoreProvider>
    )
})

