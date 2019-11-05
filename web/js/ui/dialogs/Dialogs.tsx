import {Confirm} from './Confirm';
import * as React from 'react';
import {InjectedComponent, ReactInjector} from '../util/ReactInjector';
import {Prompt, PromptProps} from './Prompt';
import {Blackout} from '../blackout/Blackout';

export class Dialogs {

    public static confirm(opts: DialogConfirmProps) {

        let injected: InjectedComponent | undefined;

        Blackout.enable();

        const cleanup = () => {
            Blackout.disable();
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

    public static prompt(opts: PromptProps) {

        let injected: InjectedComponent | undefined;

        Blackout.enable();

        const cleanup = () => {
            Blackout.disable();
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

export interface DialogConfirmProps {

    readonly title: string;
    readonly subtitle: string;
    readonly onCancel?: () => void;
    readonly onConfirm: () => void;
    readonly type?: 'danger' | 'warning';
    readonly noCancel?: boolean;

}
