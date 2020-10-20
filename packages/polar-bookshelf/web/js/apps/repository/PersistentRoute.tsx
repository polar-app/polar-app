import {Route, Switch} from "react-router-dom";
import * as React from "react";
import isEqual from "react-fast-compare";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../hooks/ReactLifecycleHooks";

interface IProps {
    readonly children: React.ReactElement;
    readonly path: string | string[];
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

export interface IPersistentRouteContext {
    readonly active: boolean;
}

const PersistentRouteContext = React.createContext<IPersistentRouteContext>({active: true});

export function usePersistentRouteContext() {
    return React.useContext(PersistentRouteContext);
}

export const PersistentRoute = React.memo((props: IProps) => {

    const [active, setActive] = React.useState(false);

    const display = active ? 'flex' : 'none';

    return (

        <>
            <Switch>
                <Route path="/">
                    <div className="PersistentRoute"
                         style={{
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
                    <MountListener onMounted={setActive}/>
                </Route>
            </Switch>

       </>
    );

}, isEqual);
