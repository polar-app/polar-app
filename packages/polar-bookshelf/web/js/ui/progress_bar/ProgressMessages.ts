import {Broadcasters} from 'polar-electron-framework/src/Broadcasters';
import {ProgressMessage} from './ProgressMessage';
import {Messenger} from 'polar-electron-framework/src/Messenger';
import {TypedMessage} from '../../util/TypedMessage';
import {DesktopAppRuntime} from "polar-electron-framework/src/DesktopAppRuntime";

export class ProgressMessages {

    public static CHANNEL: string = '/progress-message';

    public static broadcast(progressMessage: ProgressMessage) {

        if (DesktopAppRuntime.get() === 'electron-main') {
            // this is done so that the main process in electron can send a
            // progress message.
            Broadcasters.send(this.CHANNEL, progressMessage);
        } else {

            const message: TypedMessage<ProgressMessage> = {
                type: this.CHANNEL,
                value: progressMessage
            };

            Messenger.postMessage({message})
                .catch(err => console.error("Could not send message: ", err));

        }

    }

}
