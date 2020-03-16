import {Confirm} from './Confirm';
import * as React from 'react';
import {InjectedComponent, ReactInjector} from '../util/ReactInjector';
import {Prompt, PromptProps} from './Prompt';
import {Blackout} from '../blackout/Blackout';
import {Alert} from "./Alert";

export class Dialogs {

    public static confirm(opts: ConfirmProps) {

        let injected: InjectedComponent | undefined;

        const cleanup = () => {
            injected!.destroy();
        };

        const onCancel = () => {
            cleanup();

            if (opts.onCancel) {
                opts.onCancel();
            }
        };

        const onConfirm = () => {
            cleanup();
            opts.onConfirm();
        };

        injected = ReactInjector.inject(<Confirm {...opts} onCancel={onCancel} onConfirm={onConfirm}/>);

    }

    public static alert(opts: AlertProps) {

        let injected: InjectedComponent | undefined;

        const cleanup = () => {
            injected!.destroy();
        };

        const onConfirm = () => {
            cleanup();
            opts.onConfirm();
        };

        injected = ReactInjector.inject(<Alert {...opts} onConfirm={onConfirm}/>);

    }

    public static prompt(opts: PromptProps) {

        let injected: InjectedComponent | undefined;

        const cleanup = () => {
            injected!.destroy();
        };

        const onCancel = () => {
            cleanup();
            opts.onCancel();
        };

        const onDone = (value: string) => {
            cleanup();
            opts.onDone(value);
        };

        injected = ReactInjector.inject(<Prompt {...opts} onCancel={onCancel} onDone={onDone}/>);

    }

}

export interface AlertProps {

    readonly title: string;
    readonly body: string | React.ReactElement;
    readonly onConfirm: () => void;
    readonly type?: 'danger' | 'warning' | 'success' | 'info';

}


export interface ConfirmProps {

    readonly title: string;
    readonly subtitle: string | JSX.Element;
    readonly onCancel?: () => void;
    readonly onConfirm: () => void;
    readonly type?: 'danger' | 'warning' | 'success' | 'info';
    readonly noCancel?: boolean;

}
