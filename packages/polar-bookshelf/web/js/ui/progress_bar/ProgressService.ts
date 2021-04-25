import {ipcRenderer} from "electron";
import {ProgressMessage} from "./ProgressMessage";
import {ProgressMessages} from "./ProgressMessages";
import {DeterminateProgressBar} from './DeterminateProgressBar';
import {Logger} from 'polar-shared/src/logger/Logger';
import {TypedMessage} from '../../util/TypedMessage';

const log = Logger.create();

export class ProgressService {

    public start(): void {

        if (ipcRenderer) {

            ipcRenderer.on(ProgressMessages.CHANNEL, (event, progressMessage: ProgressMessage) => {

                this.onProgressMessage(progressMessage);

            });

        }

        // this is done in the browser so that it can send messages to
        // itself about progress.
        window.addEventListener("message", event => this.onMessageReceived(event), false);

    }


    private onMessageReceived(event: any) {

        switch (event.data.type) {

            case ProgressMessages.CHANNEL:

                const typedMessage = <TypedMessage<ProgressMessage>> event.data;

                this.onProgressMessage(typedMessage.value);
                break;

        }

    }

    private onProgressMessage(progressMessage: ProgressMessage) {
        DeterminateProgressBar.update(progressMessage);
    }

}
