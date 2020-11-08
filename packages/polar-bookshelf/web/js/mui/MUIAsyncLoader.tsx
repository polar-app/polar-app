import * as React from "react";
import {MUILoading} from "./MUILoading";
import {useAsyncWithError} from "../hooks/ReactLifecycleHooks";

interface IProps<T> {
    readonly provider: () => Promise<T>;
    readonly render: (props: T) => React.ReactElement;
    readonly onReject?: (err: Error) => void;
}

export const MUIAsyncLoader = function<T>(props: IProps<T>) {

    const data = useAsyncWithError({promiseFn: props.provider, onReject: props.onReject});

    if (data) {
        return React.createElement(props.render, data);
    }

    return <MUILoading/>;
};
