// FIXME refactor as this is basically the wrong place for this

import {Route, Switch} from "react-router-dom";
import * as React from "react";
import isEqual from "react-fast-compare";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../hooks/lifecycle";

interface IProps {
    readonly children: React.ReactElement;
    readonly path: string;
    readonly exact?: boolean;

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

    const display = mounted ? 'flex' : 'none';

    return (

        <>
            <Switch>
                <Route path="/">
                    <div style={{
                             display,
                             minHeight: 0,
                             flexDirection: 'column',
                             flexGrow: 1
                         }}>
                        {props.children}
                    </div>
                </Route>

            </Switch>

            <Switch>
                <Route exact path={props.path}>
                    <MountListener onMounted={setMounted}/>
                </Route>
            </Switch>

       </>

    );

}, isEqual);
