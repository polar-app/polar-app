import * as React from 'react';
import {InjectedComponent, ReactInjector} from '../util/ReactInjector';
import {PromptProps} from './Prompt';
import {Alert} from "./Alert";
import {ConfirmDialog} from './ConfirmDialog';
import {PromptDialog} from "./PromptDialog";

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

        const onAccept = () => {
            cleanup();
            opts.onConfirm();
        };

        injected = ReactInjector.inject(<ConfirmDialog {...opts}
                                                       onCancel={onCancel}
                                                       onAccept={onAccept}/>);

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

        injected = ReactInjector.inject(<PromptDialog {...opts} onCancel={onCancel} onDone={onDone}/>);

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
    readonly type?: 'danger' | 'error' | 'warning' | 'success' | 'info';
    readonly noCancel?: boolean;

}
