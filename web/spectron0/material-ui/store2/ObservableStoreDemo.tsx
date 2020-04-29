import React from 'react';
import {
    CallbacksFactory,
    createObservableStore,
    useObservableStore
} from "./ObservableStore";
import Button from "@material-ui/core/Button";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface MyInvitation {
    readonly invited: boolean;
}

interface MyInvitationCallbacks {
    readonly toggleInvited: () => void;
}

// FIXME: would be nice to provide a factory that can make the callbacks and
// automaticaly set them up and then just provide useFoo functions back to
// me...

const invitationStore: MyInvitation = {
    invited: false
}

const callbacksFactory: CallbacksFactory<MyInvitation, MyInvitationCallbacks> = (store, setStore) => {
    return {
        toggleInvited: () => {
            console.log("FIXME: toggling invited");
            const invited = ! store.current.invited;
            setStore({invited});
        }
    }
};

const [MyInvitationStoreProvider, useMyInvitationStore, useMyInvitationStoreCallbacks]
    = createObservableStore<MyInvitation, MyInvitationCallbacks>(invitationStore, callbacksFactory);

const ChildComponent = () => {

    const store = useMyInvitationStore();
    const callbacks = useMyInvitationStoreCallbacks();

    return (
        <div>
            <div>child component: {store.invited ? 'true' : 'false'}</div>
            <Button variant="contained"
                    onClick={callbacks.toggleInvited}>
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
        <MyInvitationStoreProvider value={{invited: true}}>
            <IntermediateComponent/>
        </MyInvitationStoreProvider>
    );

}
