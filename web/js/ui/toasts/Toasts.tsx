import * as React from "react";
import {Button} from "reactstrap";
import {TimesIcon} from "../icons/FixedWidthIcons";

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
    <div className="rounded shadow"
         style={{
             display: 'flex',
         }}>

        <div style={{
                width: '0.5em',
                backgroundColor: 'var(--danger400)'
             }}
             className="rounded-left">
        </div>

        <div style={{
                 flexGrow: 1,
                 display: 'flex',
                 flexDirection: 'column'
             }}>

            <div style={{
                     display: 'flex'
                 }}>

                <div className="mt-auto mb-auto pl-1" style={{flexGrow: 1}}>
                    {/*<i className="fas fa-exclamation-circle text-danger "/>*/}
                    {/*&nbsp;*/}
                    <b>{props.title}</b>
                </div>

                <div>
                    <Button color="clear" className="mt-1 mb-1 p-0">
                        <TimesIcon/>
                    </Button>
                </div>

            </div>

            <div className="p-1">

                <div>
                    {props.message}
                </div>

            </div>

            <div className="p-1 text-right">

                <Button color="clear" className="text-muted">
                    Copy Error
                </Button>

                <Button color="clear">
                    Dismiss
                </Button>

            </div>

        </div>

        {/*<div className="pt-1">*/}
        {/*    /!*<i className="fas fa-exclamation-circle text-white" style={{fontSize: '2.5em'}}/>*!/*/}
        {/*</div>*/}

        {/*<div className="pl-2 pr-2" style={{flexGrow: 1}}>*/}


        {/*</div>*/}

        {/*<div>*/}
        {/*    <Button color="clear">Copy Error</Button>*/}
        {/*</div>*/}

    </div>
);

export class Toasts {

}

export interface IProps {

}

export interface IState {

}

export type ToastType = 'info' | 'success' | 'warn' | 'error';

export interface IError {
    readonly message: string;
    readonly stack: string;
}

export interface IToastInfo {
    readonly type: 'info';
    readonly title: string;
    readonly message: string;
}

export interface IToastError {
    readonly type: 'error';
    readonly title: string;
    readonly message: string;
    readonly err: IError;
}


