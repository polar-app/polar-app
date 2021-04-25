import * as React from "react";
import {useZenModeStore} from "./ZenModeStore";

interface IProps {
    readonly children: JSX.Element;
}

export const ZenModeInactiveContainer = React.memo(function ZenModeInactiveContainer(props: IProps) {

    const {zenMode} = useZenModeStore(['zenMode']);

    if (! zenMode) {
        return null;
    } else {
        return props.children;
    }

})
