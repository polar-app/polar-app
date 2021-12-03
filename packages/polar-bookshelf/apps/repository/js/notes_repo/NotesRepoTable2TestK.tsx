import React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import {NotesRepoTable2, TableGridStoreProvider} from "./NotesRepoTable2";
import {BlocksStoreProvider} from '../../../../web/js/notes/store/BlocksStore';
import {BlockStoreContextProvider} from "../../../../web/js/notes/store/BlockStoreContextProvider";
import {assertJSON} from "polar-test/src/test/Assertions";
import {createRenderSnapshotAndReset} from "../../../../web/js/profiler/ProfiledComponents";
import {assert} from 'chai';

describe("NotesRepoTable2", function() {

    const Test = () => {
        return (
            <BlockStoreContextProvider uid='123'>
                <BlocksStoreProvider>
                    <TableGridStoreProvider>

                        <NotesRepoTable2/>
                    </TableGridStoreProvider>
                </BlocksStoreProvider>
            </BlockStoreContextProvider>
        );
    }

    it("test re-render performance", async () => {

        // TODO: register the re-render component and track re-renders

        render(<Test/>);

        await waitFor(() => screen.getByText("World War II"))

        const snapshot = createRenderSnapshotAndReset()
        assert.notDeepEqual(snapshot, []);

        assertJSON(snapshot, [
            {
                "id": "NotesRepoTable2",
                "phase": "mount"
            },
            {
                "id": "NotesRepoTable2",
                "phase": "update"
            },
            {
                "id": "NotesRepoTable2",
                "phase": "update"
            },
            {
                "id": "NotesRepoTable2",
                "phase": "update"
            },
            {
                "id": "NotesRepoTable2",
                "phase": "update"
            },
            {
                "id": "NotesRepoTable2",
                "phase": "update"
            }
        ]);

    });

})
