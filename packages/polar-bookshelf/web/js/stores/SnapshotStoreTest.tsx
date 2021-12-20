import React from 'react'
import {render} from '@testing-library/react'
import {createSnapshotStore} from "./SnapshotStore";
import {assert} from 'chai';

interface IValue {
    readonly name: string;
}

interface IRef<V> {
    current: V;
}

const [TestStoreProvider, useTestStore] = createSnapshotStore<IValue>();

describe("SnapshotStore", function() {

    it("Test no child render until first snapshot", async () => {

        const fallbackRendered: IRef<boolean> = {current: false};
        const testInnerRendered: IRef<boolean> = {current: false};

        const subscribed: IRef<boolean> = {current: false};
        const unsubscribed: IRef<boolean> = {current: false};

        const TestInner = () => {

            React.useEffect(() => {
                testInnerRendered.current = true
            })

            return null;

        }

        const subscriber = () => {

            console.log("subscribed");
            subscribed.current = true;

            return () => {
                console.log("unsubscribed");
                unsubscribed.current = true;
            };

        }

        const Fallback = () => {

            React.useEffect(() => {
                fallbackRendered.current = true
            })

            return null;

        }

        const Test = () => {

            return (
                <TestStoreProvider subscriber={subscriber} fallback={<Fallback/>}>
                    <TestInner/>
                </TestStoreProvider>
            );

        };

        const {unmount} = render(<Test/>)

        assert.isTrue(fallbackRendered.current)
        assert.isTrue(subscribed.current)

        unmount();
        assert.isTrue(unsubscribed.current)
        assert.isFalse(testInnerRendered.current);

        // await waitFor(() => screen.getByText("Name: Alice"))
        //
        // fireEvent.click(screen.getByText('Change Name'))
        //
        // await waitFor(() => screen.getByText("Name: Bob"))

    });


    it("Test the SnapshotStore with multiple successful snapshots", async () => {
        //
        // const TestInner = () => {
        //
        //     const testStore = useTestStore();
        //     const testStoreSetter = useTestStoreSetter();
        //
        //     const handleClick = React.useCallback(() => {
        //         testStoreSetter({name: 'Bob'});
        //     }, [testStoreSetter])
        //
        //     return (
        //         <div>
        //             <div>Name: {testStore.name}</div>
        //             <Button onClick={handleClick}>Change Name</Button>
        //         </div>
        //     );
        //
        // }
        //
        // const Test = () => {
        //
        //     return (
        //         <TestStoreProvider initialStore={{name: 'Alice'}}>
        //             <TestInner/>
        //         </TestStoreProvider>
        //     );
        //
        // };
        //
        // render(<Test/>)
        //
        // await waitFor(() => screen.getByText("Name: Alice"))
        //
        // fireEvent.click(screen.getByText('Change Name'))
        //
        // await waitFor(() => screen.getByText("Name: Bob"))

    });

})
