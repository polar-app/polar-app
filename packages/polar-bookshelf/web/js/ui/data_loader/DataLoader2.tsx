import * as React from 'react';
import Alert from "@material-ui/lab/Alert";
import {SnapshotSubscriber} from "polar-shared/src/util/Snapshots";
import {typedMemo} from "../../hooks/ReactHooks";
import {useComponentDidMount, useComponentWillUnmount} from "../../hooks/ReactLifecycleHooks";

export interface IDataProps<T> {
    readonly data: T | undefined;
}

export interface IErrorProps {
    readonly err: Error;
}

export interface IProps<T> {

    /**
     * An ID for this loader for logging purposes.
     */
    readonly id: string;

    readonly provider: SnapshotSubscriber<T>;

    /**
     * Called when we need to render data from our provider function.  If the value you're working
     * with must be undefined then use a value object.
     */
    readonly Component: React.FunctionComponent<IDataProps<T>>;

    readonly Error?: React.FunctionComponent<IErrorProps>;

}

export interface IState<T> {
    readonly data: DataResult<T> | undefined;
}


export const DataLoader2 = typedMemo(function<T>(props: IProps<T>) {

    const {Component, Error} = props;
    const unsubscriberRef = React.useRef<Unsubscriber | undefined>(undefined)
    const unmountedRef = React.useRef(false);
    const [state, setState] = React.useState<IState<T>>({data: undefined});

    const onNext = React.useCallback((value: T | undefined) => {

        if (unmountedRef.current) {
            console.warn("DataLoader was unmounted but received event");
            return;
        }

        if (value) {

            const data: DataResultValue<T> = {
                value,
                err: undefined
            };

            setState({
                data
            });

        } else {

            setState({
                data: undefined
            });

        }

    }, []);

    const onError = React.useCallback((err: Error) => {

        const data: DataResultError = {
            err,
            value: undefined
        };

        setState({
            data
        });

    }, []);

    useComponentDidMount(() => {
        unsubscriberRef.current = props.provider(onNext, onError);
    })

    useComponentWillUnmount(() => {
        unmountedRef.current = true;

        if (unsubscriberRef.current) {
            unsubscriberRef.current();
        }
    })

    if (state.data && state.data.err) {

        if (Error) {
            return (
                <Error err={state.data.err}/>
            );
        } else {
            return (
                <Alert severity="error">
                    Error: {state.data.err.message}
                </Alert>
            );
        }

    } else {
        return props.Component({data: state.data?.value});
    }

});

/**
 * Func that can be used to unregister the provider;
 */
export type Unsubscriber = () => void;

export interface DataResultError {
    readonly err: Error;
    readonly value: undefined;
}

export interface DataResultValue<D> {
    readonly value: D;
    readonly err: undefined;
}

export type DataResult<D> = DataResultError | DataResultValue<D>;
