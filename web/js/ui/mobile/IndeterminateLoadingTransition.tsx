import * as React from 'react';
import {IndeterminateProgressBar} from "../progress_bar/IndeterminateProgressBar";
import { Logger } from 'polar-shared/src/logger/Logger';

const log = Logger.create();

/**
 * Show an indeterminate progress bar while a promise is finishing up.
 */
export class IndeterminateLoadingTransition extends React.Component<IProps, IState> {

    private unmounted: boolean = false;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            loaded: undefined
        };

    }
    public componentDidMount(): void {

        const handler = async () => {

            const component = await this.props.provider();

            this.setState({
                loaded: component
            });

        };

        handler()
            .catch(err => log.error("Could not load: ", err));

    }

    public componentWillUnmount(): void {

        this.unmounted = true;

    }

    public render() {

        if (this.state.loaded) {
            return this.state.loaded;
        }

        return (

            <div style={{
                     position: 'absolute',
                     top: 0,
                     left: 0,
                     width: '100%',
                     zIndex: 1000000
                 }}>

                <IndeterminateProgressBar style={{width: '100%'}}/>

            </div>

        );

    }

}

export interface IProps {

    /**
     * The component that provides a rendered element
     */
    readonly provider: () => Promise<JSX.Element>;
}

export interface IState {
    readonly loaded: JSX.Element | undefined;
}
