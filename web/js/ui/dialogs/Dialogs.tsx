import * as React from 'react';
import {InjectedComponent, ReactInjector} from '../util/ReactInjector';
import {ConfirmDialog} from './ConfirmDialog';
import {ConfirmProps} from "./ConfirmProps";

export class Dialogs {

    /**
     * @Deprecated MUI
     */
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

}

