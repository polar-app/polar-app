// FIXME refactor as this is basically the wrong place for this

import {Route} from "react-router-dom";
import * as React from "react";
import isEqual from "react-fast-compare";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../hooks/lifecycle";

interface IProps {
    children: React.ReactElement;
    path: string;
    exact?: boolean;

}

interface MountListenerProps {
    readonly onMounted: (mounted: boolean) => void;
}

const MountListener = React.memo((props: MountListenerProps) => {

    useComponentDidMount(() => props.onMounted(true));
    useComponentWillUnmount(() => props.onMounted(false));

    return null;

}, isEqual);

export const PersistentRoute = React.memo((props: IProps) => {

    const [mounted, setMounted] = React.useState(false);

    const display = mounted ? undefined : 'none';

    return (

        <>

            <div style={{display}}>
                {props.children}
            </div>

            <Route exact path={props.path}>
                <MountListener onMounted={setMounted}/>
            </Route>

       </>

    );

}, isEqual);
