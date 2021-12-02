import React, {Profiler, ProfilerOnRenderCallback} from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import {NotesRepoTable2, TableGridStoreProvider} from "./NotesRepoTable2";
import {BlocksStoreProvider} from '../../../../web/js/notes/store/BlocksStore';
import {BlockStoreContextProvider} from "../../../../web/js/notes/store/BlockStoreContextProvider";
import {assertJSON} from "polar-test/src/test/Assertions";

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

    xit("test re-render performance", async () => {

        // TODO: register the re-render component and track re-renders

        interface IRender {
            readonly id: string;
            readonly phase: string;
        }

        let renders: IRender[] = [];

        const handleRender: ProfilerOnRenderCallback = (id, phase) => {
            console.log(`id: ${id}, phase: ${phase}`);
            renders.push({id, phase});
        }

        render(<Profiler id="profiler" onRender={handleRender}><Test/></Profiler>)

        await waitFor(() => screen.getByText("World War II"))

        assertJSON(renders , []);


    });

})
