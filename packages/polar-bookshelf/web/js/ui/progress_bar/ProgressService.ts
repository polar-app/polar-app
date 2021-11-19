import {ProgressMessage} from "./ProgressMessage";
import {ProgressMessages} from "./ProgressMessages";
import {DeterminateProgressBar} from './DeterminateProgressBar';
import {TypedMessage} from '../../util/TypedMessage';
import {ElectronIpcRenderers} from "polar-electron-framework/src/ElectronIpcRenderers";
import {DesktopAppRuntime} from "polar-electron-framework/src/DesktopAppRuntime";

export class ProgressService {

    public start(): void {

        if (DesktopAppRuntime.isElectronRenderer()) {

            ElectronIpcRenderers.on(ProgressMessages.CHANNEL, (event, progressMessage: ProgressMessage) => {

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
