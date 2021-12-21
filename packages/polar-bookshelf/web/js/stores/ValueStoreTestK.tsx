import React from 'react'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {createValueStore} from "./ValueStore";
import Button from '@material-ui/core/Button';

describe("ValueStore", function() {

    it("Change internal store value and verify hooks reload", async () => {

        interface IValue {
            readonly name: string;
        }

        const [TestStoreProvider, useTestStore, useTestStoreSetter] = createValueStore<IValue>()

        const TestInner = () => {

            const testStore = useTestStore();
            const testStoreSetter = useTestStoreSetter();

            const handleClick = React.useCallback(() => {
                testStoreSetter({name: 'Bob'});
            }, [testStoreSetter])

            return (
                <div>
                    <div>Name: {testStore.name}</div>
                    <Button onClick={handleClick}>Change Name</Button>
                </div>
            );

        }

        const Test = () => {

            return (
                <TestStoreProvider initialStore={{name: 'Alice'}}>
                    <TestInner/>
                </TestStoreProvider>
            );

        };

        render(<Test/>)

        await waitFor(() => screen.getByText("Name: Alice"))

        fireEvent.click(screen.getByText('Change Name'))

        await waitFor(() => screen.getByText("Name: Bob"))

    });

})
