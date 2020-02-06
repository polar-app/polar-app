import * as React from "react";

type MessageEventHandler = (message: MessageEvent) => void;

/**
 * Used to display and present toasts on the screen.
 */
export class ToastsManager extends React.Component<IProps> {

    private listener: MessageEventHandler | undefined = undefined;

    public componentDidMount(): void {

        this.listener = (message: MessageEvent) => {
            // TODO: update the state so we have a copy of the so that the UI can
            // refresh with the notification.
        };

        window.addEventListener('message', this.listener);

    }

    public componentWillUnmount() {

    }

    public render() {
        return undefined;
    }

}

export const ToastError = (props: IToastError) => (
    <div className="p-1 border rounded"
         style={{display: 'flex'}}>

        <div>
            <i className="fas fa-exclamation-circle text-danger" style={{fontSize: '3em'}}/>
        </div>

    </div>
);

export class Toasts {

}

export interface IProps {

}

export interface IState {

}

export type ToastType = 'info' | 'success' | 'warn' | 'error';

export interface IToastInfo {
    readonly type: 'info';
    readonly title: string;
    readonly message: string;
}

export interface IToastError {
    readonly type: 'error';
    readonly title: string;
    readonly message: string;
    readonly err: Error;
}


