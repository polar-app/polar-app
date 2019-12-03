import * as React from 'react';
import {Alert} from "reactstrap";

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

        if (this.state.data && this.state.data.err) {

            if (this.props.error) {
                return this.props.error(this.state.data.err);
            } else {
                return <Alert color="danger">
                    Error: {this.state.data.err.message}
                </Alert>;
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
