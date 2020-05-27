import * as React from 'react';
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../hooks/lifecycle";
import {
    SnapshotSubscriber,
    SnapshotUnsubscriber
} from "../../firebase/SnapshotSubscribers";
import Alert from "@material-ui/lab/Alert";

export namespace DataSubscribers {

    export interface DataProviderProps {
        readonly children: React.ReactElement;
    }

    export type DataProvider = (props: DataProviderProps) => React.ReactElement;

    export type DataSubscriberTuple<D> = [DataProvider, React.Context<D>];

    export function create<D>(snapshotSubscriber: SnapshotSubscriber<D>) {

        const context = React.createContext<D | undefined>(undefined);

        const component: DataProvider = (props: DataProviderProps) => {

            const [data, setData] = React.useState<D | undefined>(undefined);
            const [err, setError] = React.useState<Error | undefined>(undefined);

            const unsubscriber = React.useRef<SnapshotUnsubscriber>();

            useComponentDidMount(() => {

                const onNext = (value: D | undefined) => {

                    if (this.unmounted) {
                        console.warn("DataLoader was unmounted but received event");
                        return;
                    }

                    if (value) {
                        setData(value);
                    } else {
                        setData(undefined);
                    }

                };


                const onError = (err: Error) => {
                    setError(err);
                };

                unsubscriber.current = snapshotSubscriber(onNext, onError);

            });

            useComponentWillUnmount(() => {

                if (unsubscriber.current) {
                    unsubscriber.current();
                }

            });

            if (err) {
                return (
                    <Alert severity="error">
                        Error: {this.state.data.err.message}
                    </Alert>
                );
            }

            return (
                <context.Provider value={data}>
                    {props.children}
                </context.Provider>
            );

        }

        return [component, context];

    }

}
