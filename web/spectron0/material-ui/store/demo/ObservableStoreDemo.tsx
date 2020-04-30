import React, {useState} from 'react';
import Button from "@material-ui/core/Button";
import {TagStoreProvider} from './TagStoreDemo';
import { useMyInvitationStore, useMyInvitationStoreCallbacks, MyInvitationStoreProvider } from './MyInvitationStoreDemo';

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
        <TagStoreProvider>
            <MyInvitationStoreProvider value={{invited: true}}>
                <IntermediateComponent/>
            </MyInvitationStoreProvider>
        </TagStoreProvider>
    );

}
