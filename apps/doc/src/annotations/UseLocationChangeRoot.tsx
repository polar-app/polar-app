import React from 'react';
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {useComponentDidMount} from "../../../../web/js/hooks/ReactLifecycleHooks";
import {
    useLocationChangeStore,
    useUseLocationChangeCallbacks
} from "./UseLocationChangeStore";
import {useLocation} from "react-router-dom";

interface IProps {
    readonly children: React.ReactElement;
}

export const UseLocationChangeRoot = deepMemo((props: IProps) => {

    const {prevLocation} = useLocationChangeStore(['prevLocation']);
    const {setPrevLocation, setLocation} = useUseLocationChangeCallbacks();

    const routerLocation = useLocation();

    if (prevLocation) {

        if (routerLocation.hash !== prevLocation.hash ||
            routerLocation.pathname !== prevLocation.pathname) {

            setPrevLocation(routerLocation);
            setLocation(routerLocation);

        }

    }

    useComponentDidMount(() => {
        setPrevLocation(routerLocation);
    });

    return props.children;

});
