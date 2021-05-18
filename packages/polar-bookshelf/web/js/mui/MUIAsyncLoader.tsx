import * as React from "react";
import {useAsyncWithError} from "../hooks/ReactLifecycleHooks";
import CircularProgress from "@material-ui/core/CircularProgress";

interface IProps<T> {
    readonly provider: () => Promise<T>;
    readonly render: (props: T) => React.ReactElement;
    readonly onReject?: (err: Error) => void;
}

export const MUIAsyncLoader = React.memo(function MUIAsyncLoader<T>(props: IProps<T>) {

    // TODO: we might not want to use a dialog box here... just an error in the content
    const data = useAsyncWithError({promiseFn: props.provider, onReject: props.onReject});

    if (data) {
        return React.createElement(props.render, data);
    }

    return (
        <CircularProgress style={{
            margin: 'auto',
            width: '75px',
            height: '75px',
        }}/>
    )

});
