import {ConfirmProps, Confirm} from './Confirm';
import * as React from 'react';
import {ReactInjector} from '../util/ReactInjector';
import {InjectedComponent} from '../util/ReactInjector';

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

        injected = ReactInjector.inject(<Confirm title={opts.title}
                                                 subtitle={opts.subtitle}
                                                 onCancel={onCancel}
                                                 onConfirm={onConfirm}/>);

    }

}

