import {ProgressMessage} from './ProgressMessage';
import {TypedMessage} from '../../util/TypedMessage';

export class ProgressMessages {

    public static CHANNEL: string = '/progress-message';

    public static broadcast(progressMessage: ProgressMessage) {

        const message: TypedMessage<ProgressMessage> = {
            type: this.CHANNEL,
            value: progressMessage
        };

        window.postMessage(JSON.parse(JSON.stringify(message)), "*");

    }

}
