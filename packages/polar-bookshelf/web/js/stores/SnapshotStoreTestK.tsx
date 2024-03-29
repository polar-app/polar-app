import React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import {createSnapshotStore, OnNextCallback, SnapshotSubscriber} from "./SnapshotStore";
import {assert} from 'chai';

interface IValue {
    readonly name: string;
}

interface IRef<V> {
    current: V;
}

const [TestStoreProvider, useTestStore, TestStoreLoader, TestStoreLatch] = createSnapshotStore<IValue>('test');

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
                <TestStoreProvider>
                    <>
                        <TestStoreLoader subscriber={subscriber}/>

                        <TestStoreLatch fallback={<Fallback/>}>
                            <TestInner/>
                        </TestStoreLatch>
                    </>
                </TestStoreProvider>
            );

        };

        const {unmount} = render(<Test/>);

        assert.isTrue(fallbackRendered.current)
        assert.isTrue(subscribed.current)

        unmount();
        assert.isTrue(unsubscribed.current)
        assert.isFalse(testInnerRendered.current);

    });

    it("Test with successful snapshots and then error", async () => {

        const TestInner = () => {

            const testStore = useTestStore();

            return (
                <>
                    {testStore.right && (
                        <div>Name: {testStore.right.name}</div>
                    )}

                    {testStore.left && (
                        <div>Error detected</div>
                    )}

                </>
            );

        }

        const onNextRef: IRef<OnNextCallback<IValue>> = {current: null!};
        const onErrorRef: IRef<OnNextCallback<IValue>> = {current: null!};

        const subscriber: SnapshotSubscriber<IValue> = (onNext, onError) => {

            onNextRef.current = onNext;
            onErrorRef.current = onError;

            return () => {
                onNextRef.current = null!;
                onErrorRef.current = null!;
            };

        }

        const Fallback = () => {
            return null;
        }

        const Test = () => {

            return (
                <TestStoreProvider>

                    <>
                        <TestStoreLoader subscriber={subscriber}/>

                        <TestStoreLatch fallback={<Fallback/>}>
                            <TestInner/>
                        </TestStoreLatch>
                    </>

                </TestStoreProvider>
            );

        };

        render(<Test/>);

        onNextRef.current({name: 'Alice'});

        await waitFor(() => screen.getByText("Name: Alice"))

        onNextRef.current({name: 'Bob'});

        await waitFor(() => screen.getByText("Name: Bob"))

        onErrorRef.current(new Error("Fake error"));

        await waitFor(() => screen.getByText("Error detected"))

    });


})
