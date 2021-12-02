import React from 'react'
import {render} from '@testing-library/react'
import {NotesRepoTable2, TableGridStoreProvider} from "./NotesRepoTable2";
import {BlocksStoreProvider} from '../../../../web/js/notes/store/BlocksStore';
import {BlockStoreContextProvider} from "../../../../web/js/notes/store/BlockStoreContextProvider";

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

        render(<Test/>)

        // await waitFor(() => screen.getByText("The user clicked the button!"))

    });

})
