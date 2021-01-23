import {Route, Switch} from "react-router-dom";
import * as React from "react";
import isEqual from "react-fast-compare";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../hooks/ReactLifecycleHooks";
import {deepMemo} from "../../react/ReactUtils";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import clsx from "clsx";

const useStyles = makeStyles((theme) =>
    createStyles({
        active: {
        },

        /**
         * The inactive styles can not use display 'none' because if they do the
         * iframe loses its scrolling position on chrome.
         */
        inactive: {
            visibility: 'hidden',
            height: 0,
            maxHeight: 0,
        }

    }),
);


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

export const PersistentRoute = deepMemo((props: IProps) => {

    const classes = useStyles();
    const [active, setActive] = React.useState(false);

    const className = active ? classes.active : classes.inactive;

    return (

        <>
            <Switch>

                <Route path="/">
                    <div className={clsx('PersistentRoute', className)}
                         style={{
                             display: 'flex',
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

});
