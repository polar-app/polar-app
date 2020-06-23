import {ipcRenderer, remote} from 'electron';
import {WindowChannels} from './WindowChannels';

export class WebContentsNotifiers {

    public static dispatchEvent<M>(channel: string, message: M) {

        const id = remote.getCurrentWebContents().id;
        const windowChannel = WindowChannels.createFromID(id, channel);

        ipcRenderer.send(windowChannel, message);

    }

}
