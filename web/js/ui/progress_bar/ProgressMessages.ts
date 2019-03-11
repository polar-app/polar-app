/**
 *
 */
import {Broadcasters} from '../../ipc/Broadcasters';
import {ProgressMessage} from './ProgressMessage';

export class ProgressMessages {

    public static CHANNEL: string = '/progress-message';

    public static broadcast(progressMessage: ProgressMessage) {
        Broadcasters.send(this.CHANNEL, progressMessage);
    }

}
