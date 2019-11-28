import * as React from 'react';
import {Logger} from "polar-shared/src/logger/Logger";

export class DataLoader<T> extends React.Component<IProps<T>, IState<T>> {

    private unsubscriber: Unsubscriber | undefined;

    private unmounted: boolean = false;

    constructor(props: IProps<T>, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public componentDidMount(): void {

        this.unsubscriber = this.props.provider(data => {

            if (this.unmounted) {
                return;
            }

            this.setState({data});

        });

    }

    public componentWillUnmount(): void {

        this.unmounted = true;

        if (this.unsubscriber) {
            this.unsubscriber();
        }

    }

    public render() {
        if (this.state.data) {

            if (this.state.data.value) {
                return this.props.render(this.state.data.value);
            } else if (this.state.data.err) {
                return this.props.error(this.state.data.err);
            } else {
                return null;
            }

        } else {
            return this.props.pending();
        }
    }

}

/**
 * Func that can be used to unregister the provider;
 */
export type Unsubscriber = () => void;

export interface DataCallback<D> {
    // tslint:disable-next-line:callable-types
    (data: DataResult<D>): void;
}


export interface DataProvider<D> {
    // tslint:disable-next-line:callable-types
    (listener: DataCallback<D>): Unsubscriber;
}

export interface IProps<D> {

    readonly provider: DataProvider<D>;

    /**
     * Called when we need to render data from our provider function.
     */
    readonly render: (data: D) => React.ReactElement;

    readonly error: (err: Error) => React.ReactElement;

    /**
     * Called when we have no data and it's still loading.
     */
    readonly pending: () => React.ReactElement;

}

export interface IState<D> {
    readonly data?: DataResult<D>;
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
