/**
 *
 */
import {Broadcasters} from '../../ipc/Broadcasters';
import {ProgressMessage} from './ProgressMessage';

export class ProgressMessages {

    public static CHANNEL: string = '/progress-message';

    public static send(message: ProgressMessage) {
        Broadcasters.send(this.CHANNEL, message);
    }

}
