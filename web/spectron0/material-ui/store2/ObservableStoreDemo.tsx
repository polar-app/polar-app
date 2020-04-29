import React, {useState} from 'react';
import {
    CallbacksFactory,
    createObservableStore,
    useObservableStore
} from "./ObservableStore";
import Button from "@material-ui/core/Button";

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

interface ToggleMountedProps {
    readonly children: React.ReactNode;
}

class LegacyComponent extends React.Component {

    public componentWillUnmount(): void {
        console.log("FIXMEL legacy component unmounting");
    }

    public render() {
        return <div>legacy unmountable component</div>
    }

}

const ToggleMounted = (props: ToggleMountedProps) => {

    const [mounted, setMounted] = useState(true);

    return (
        <div>
            {mounted && <div>
                <LegacyComponent/>
                {props.children}
            </div>}

            <Button variant="contained"
                    onClick={() => setMounted(! mounted)}>
                toggle mounted
            </Button>

        </div>
    )

}

const ChildComponent = () => {

    const store = useMyInvitationStore();
    const callbacks = useMyInvitationStoreCallbacks();


    return (
        <ToggleMounted>
            <div>
                <div>child component: {store.invited ? 'true' : 'false'}</div>
                <Button variant="contained"
                        onClick={callbacks.toggleInvited}>
                    toggle
                </Button>
            </div>
        </ToggleMounted>
    );

}

const IntermediateComponent = () => {

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
