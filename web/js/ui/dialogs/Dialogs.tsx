import {Confirm, ConfirmProps} from './Confirm';
import * as React from 'react';
import {ReactInjector} from '../util/ReactInjector';
import {InjectedComponent} from '../util/ReactInjector';
import {Prompt, PromptProps} from './Prompt';

export class Dialogs {

    public static confirm(opts: ConfirmProps) {

        let injected: InjectedComponent | undefined;

        const onCancel = () => {
            injected!.destroy();
            opts.onCancel();
        };

        const onConfirm = () => {
            injected!.destroy();
            opts.onConfirm();
        };

        injected = ReactInjector.inject(<Confirm {...opts} onCancel={onCancel} onConfirm={onConfirm}/>);

    }

    public static prompt(opts: PromptProps) {

        let injected: InjectedComponent | undefined;

        const onCancel = () => {
            injected!.destroy();
            opts.onCancel();
        };

        const onDone = (value: string) => {
            injected!.destroy();
            opts.onDone(value);
        };

        injected = ReactInjector.inject(<Prompt {...opts} onCancel={onCancel} onDone={onDone}/>);

    }

}

