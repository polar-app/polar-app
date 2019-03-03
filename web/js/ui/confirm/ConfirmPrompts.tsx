import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ConfirmPrompt, ConfirmPromptProps} from './ConfirmPrompt';
import {Blackout} from '../blackout/Blackout';

const ID = 'confirm-popover-container';

export class ConfirmPrompts {

    public static create(props: ConfirmPromptProps) {

        let container = document.getElementById(ID);

        if (! container) {
            container = document.createElement('div');
            container.setAttribute('id', ID);
            document.body.appendChild(container);
        }

        Blackout.enable();

        const onCancel = () => {

            this.destroy();

            props.onCancel();

        };

        const onConfirm = () => {

            this.destroy();

            props.onConfirm();

        };

        ReactDOM.render(

            <ConfirmPrompt open={true}
                           target={props.target}
                           title={props.title}
                           subtitle={props.subtitle}
                           onCancel={onCancel}
                           placement={props.placement}
                           onConfirm={onConfirm}/>,

            container

        );

    }

    public static destroy() {

        Blackout.disable();

        this.destroyElement('#' + ID);
        this.destroyElement('.confirm-prompt');

    }

    private static destroyElement(selector: string) {

        const element = document.querySelector(selector);

        // confirm-prompt

        if (element) {
            element.innerHTML = '';
            element.parentElement!.removeChild(element);
        } else {
            // noop
        }

    }

}


