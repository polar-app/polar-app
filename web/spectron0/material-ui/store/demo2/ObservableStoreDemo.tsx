import React, {useState} from 'react';
import Button from "@material-ui/core/Button";
import {TagStoreProvider, useTagStore} from './TagStoreDemo';
import { useMyInvitationStore, useMyInvitationStoreCallbacks, MyInvitationStoreProvider } from './MyInvitationStoreDemo';
import {Preconditions} from "polar-shared/src/Preconditions";

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

function myHook() {
    const tagStore = useTagStore()
    console.log("FIXME: got my tagStore: ", tagStore);
}

const createdHook = () => myHook();

interface IMyCallbacks {
    readonly myCallback: () => void;
}
//
// const myCallback = () => {
//     useTagStore();
//     console.log("FIXME it worked");
// }

function myCallback() {
    const tagStore = useTagStore();
    console.log("FIXME it worked");
}


const myCallbacks: IMyCallbacks = {
    // myCallback: () => {
    //     useTagStore();
    //     console.log("FIXME it worked");
    // }
    myCallback
}

const ChildComponent = () => {

    const store = useMyInvitationStore();
    const callbacks = useMyInvitationStoreCallbacks();

    Preconditions.assertPresent(callbacks, "callbacks");

    return (
        <ToggleMounted>
            <div>
                <div>child component: {store.invited ? 'true' : 'false'}</div>
                <Button variant="contained"
                        onClick={callbacks.toggleInvited}>
                        {/*// onClick={myHook}>*/}
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
        <TagStoreProvider>
            <MyInvitationStoreProvider value={{invited: true}}>
                <IntermediateComponent/>
            </MyInvitationStoreProvider>
        </TagStoreProvider>
    );

}
