import React from 'react';
import {
    createObservableStoreContext,
    useObservableStore,
    createObservableStore
} from "./ObservableStore";
import Button from "@material-ui/core/Button";

const [ObservableStoreProvider, ObservableStoreContext] = createObservableStore(false);

const ChildComponent = () => {
    console.log("FIXME ChildComponent: render");

    const [store, setStore] = useObservableStore(ObservableStoreContext);

    return (
        <div>
            <div>child component: {store ? 'true' : 'false'}</div>
            <Button variant="contained"
                    onClick={() => setStore(! store)}>
                toggle
            </Button>
        </div>
    );

}

const IntermediateComponent = () => {
    console.log("FIXME IntermediateComponent: render");

    return (
        <div>
            <ChildComponent/>
            <ChildComponent/>
        </div>
    )
}

export const ObservableStoreDemo = () => {

    return (
        <ObservableStoreProvider value={true}>
            <IntermediateComponent/>
        </ObservableStoreProvider>
    );

}
