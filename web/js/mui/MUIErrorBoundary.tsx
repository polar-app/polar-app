import * as React from 'react';
import {ConfirmDialog} from "../ui/dialogs/ConfirmDialog";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface IProps {
    readonly children: JSX.Element;
}

interface IState {
    readonly hasError: false;
}

export class MUIErrorBoundary extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    static getDerivedStateFromError(error: Error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {

        // You can also log the error to an error reporting service

    }

    render() {

        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }

}

interface MUIErrorBoundaryMessageProps {
}

export const MUIErrorBoundaryMessage = (props: MUIErrorBoundaryMessageProps) => {

    const Subtitle = () => (
        <div>

            <p>
                It looks like something just broke!
            </p>

            <p>
                We're already hard at work on a resolution.  A copy of the error
                has been sent and we're going to try to get it resolved for next
                time.
            </p>

        </div>
    );

    return (
        <ConfirmDialog type='danger'
                       title="Something just broke"
                       noCancel={true}
                       noAccept={true}
                       subtitle={<Subtitle/>}
                       onCancel={NULL_FUNCTION}
                       onAccept={NULL_FUNCTION}/>
    );

}