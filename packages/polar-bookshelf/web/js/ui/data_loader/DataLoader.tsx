import * as React from 'react';
import Alert from "@material-ui/lab/Alert";
import {SnapshotSubscriber} from "polar-shared/src/util/Snapshots";

export class DataLoader<T> extends React.Component<IProps<T>, IState<T>> {

    private unsubscriber: Unsubscriber | undefined;

    private unmounted: boolean = false;

    constructor(props: IProps<T>, context: any) {
        super(props, context);

        this.state = {
            data: undefined
        };

    }

    public componentDidMount(): void {

        const onNext = (value: T | undefined) => {

            if (this.unmounted) {
                console.warn("DataLoader was unmounted but received event");
                return;
            }

            if (value) {

                const data: DataResultValue<T> = {
                    value,
                    err: undefined
                };

                this.setState({
                    data
                });

            } else {

                this.setState({
                    data: undefined
                });

            }

        };

        const onError = (err: Error) => {

            const data: DataResultError = {
                err,
                value: undefined
            };

            this.setState({
                data
            });

        };

        this.unsubscriber = this.props.provider(onNext, onError);

    }

    public componentWillUnmount(): void {

        this.unmounted = true;

        if (this.unsubscriber) {
            this.unsubscriber();
        }

    }

    public render() {

        if (this.state.data && this.state.data.err) {

            if (this.props.error) {
                return this.props.error(this.state.data.err);
            } else {
                return (
                    <Alert severity="error">
                        Error: {this.state.data.err.message}
                    </Alert>
                );
            }

        } else {

            // the value can be undefined which means that it's not loaded yet.
            return this.props.render(this.state.data?.value);
        }

    }

}

/**
 * Func that can be used to unregister the provider;
 */
export type Unsubscriber = () => void;

export interface IProps<D> {

    /**
     * An ID for this loader for logging purposes.
     */
    readonly id: string;

    readonly provider: SnapshotSubscriber<D>;

    /**
     * Called when we need to render data from our provider function.  If the value you're working
     * with must be undefined then use a value object.
     */
    readonly render: (data: D | undefined) => React.ReactElement;

    readonly error?: (err: Error) => React.ReactElement;

}

export interface IState<D> {
    readonly data: DataResult<D> | undefined;
}

export interface DataResultError {
    readonly err: Error;
    readonly value: undefined;
}

export interface DataResultValue<D> {
    readonly value: D;
    readonly err: undefined;
}

export type DataResult<D> = DataResultError | DataResultValue<D>;
