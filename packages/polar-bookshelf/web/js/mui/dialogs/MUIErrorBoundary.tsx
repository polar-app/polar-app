import React, {ErrorInfo} from 'react';
import {ConfirmDialog} from "../../ui/dialogs/ConfirmDialog";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";


interface ErrorDialogProps {
    readonly stack: string;
    readonly onAccept: () => void;
}

const ErrorDialog = (props: ErrorDialogProps) => {

    const Subtitle = () => (
        <div>

            <p>
                <b>We detected an unhandled error: </b>
            </p>

            <pre>
                {props.stack}
            </pre>

        </div>
    );

    return (

        <ConfirmDialog type='danger'
                       title="Unhandled error"
                       noCancel={true}
                       subtitle={<Subtitle/>}
                       onCancel={NULL_FUNCTION}
                       onAccept={props.onAccept}/>

    );

}

interface IProps {
    readonly children: React.ReactNode;
}

interface IErr {

    readonly error: Error | undefined;
    readonly info: ErrorInfo;

}

interface IState {
    readonly err: IErr | undefined;
}

export class MUIErrorBoundary extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {err: undefined};
    }

    componentDidCatch(error: Error, info: ErrorInfo ) {
        // Display fallback UI
        this.setState({err: {error, info}});
        console.log("Caught error at React error boundary: ", error, info.componentStack);
    }

    render() {

        if (this.state.err) {
            return (
                <>
                    <ErrorDialog stack={this.state.err.info.componentStack}
                                 onAccept={() => this.setState({err: undefined})}/>
                    {this.props.children}
                </>
            );
        }

        return this.props.children;

    }

}
