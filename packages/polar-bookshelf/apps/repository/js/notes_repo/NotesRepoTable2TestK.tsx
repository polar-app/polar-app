import React from 'react'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {NotesRepoTable2, TableGridStoreProvider} from "./NotesRepoTable2";
import {BlocksStoreProvider, useBlocksStore} from '../../../../web/js/notes/store/BlocksStore';
import {BlockStoreContextProvider} from "../../../../web/js/notes/store/BlockStoreContextProvider";
import {assertJSON} from "polar-test/src/test/Assertions";
import {createRenderSnapshotAndReset} from "../../../../web/js/profiler/ProfiledComponents";
import {assert} from 'chai';
import Button from '@material-ui/core/Button';

describe("NotesRepoTable2", function() {

    const BlockStoreMutator = () => {

        const blocksStore = useBlocksStore();
        const [deleted, setDeleted] = React.useState(false);

        const handleClick = React.useCallback(() => {

            const block = blocksStore.getBlockByName("World War II");

            if (block) {
                blocksStore.deleteBlocks([block.id]);
                setDeleted(true)
            }

        }, [blocksStore]);

        return (
            <>
                {deleted && <div>Deleted</div>}
                <Button onClick={handleClick}>Delete Block</Button>
            </>
        );
    }

    const Test = () => {
        return (
            <BlockStoreContextProvider uid='123'>
                <BlocksStoreProvider>
                    <TableGridStoreProvider>
                        <NotesRepoTable2/>
                        <BlockStoreMutator/>
                    </TableGridStoreProvider>
                </BlocksStoreProvider>
            </BlockStoreContextProvider>
        );
    }

    it("test re-render performance", async () => {

        render(<Test/>);

        await waitFor(() => screen.getByText("World War II"))

        const snapshot = createRenderSnapshotAndReset()
        assert.notDeepEqual(snapshot, []);

        assertJSON(snapshot, [
            {
                "id": "NotesRepoTableToolbar",
                "phase": "mount"
            },
            {
                "id": "NotesRepoTable2",
                "phase": "mount"
            },
            {
                "id": "NotesRepoTableToolbar",
                "phase": "update"
            },
            {
                "id": "NotesRepoTable2",
                "phase": "update"
            },
            {
                "id": "NotesRepoTableToolbar",
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

        fireEvent.click(screen.getByText('Delete Block'))

        await waitFor(() => screen.getByText("Deleted"))

        assertJSON(createRenderSnapshotAndReset(), [
            {
                "id": "NotesRepoTable2",
                "phase": "update"
            },
            {
                "id": "NotesRepoTableToolbar",
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
