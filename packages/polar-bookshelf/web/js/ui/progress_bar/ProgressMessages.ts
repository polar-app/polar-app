import {ProgressMessage} from './ProgressMessage';
import {Messenger} from 'polar-electron-framework/src/Messenger';
import {TypedMessage} from '../../util/TypedMessage';

export class ProgressMessages {

    public static CHANNEL: string = '/progress-message';

    public static broadcast(progressMessage: ProgressMessage) {

        const message: TypedMessage<ProgressMessage> = {
            type: this.CHANNEL,
            value: progressMessage
        };

        Messenger.postMessage({message})
            .catch(err => console.error("Could not send message: ", err));

    }

}
