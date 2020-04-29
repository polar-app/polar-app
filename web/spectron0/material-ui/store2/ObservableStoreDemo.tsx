import React from 'react';
import {
    createObservableStoreContext,
    useObservableStore
} from "./ObservableStore";
import Button from "@material-ui/core/Button";


const [InvitedContext, InvitedContextValue] = createObservableStoreContext(false);

const ChildComponent = () => {
    console.log("FIXME ChildComponent: render");

    const [store, setStore] = useObservableStore(InvitedContext);

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
        <InvitedContext.Provider value={InvitedContextValue}>
            <IntermediateComponent/>
        </InvitedContext.Provider>
    );

}
