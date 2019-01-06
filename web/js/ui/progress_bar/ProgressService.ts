import {ipcRenderer} from "electron";
import {ProgressMessage} from "./ProgressMessage";
import {ProgressMessages} from "./ProgressMessages";
import {ProgressBar} from './ProgressBar';

/**
 *
 */
export class ProgressService {

    public start(): void {

        ipcRenderer.on(ProgressMessages.CHANNEL, (event: Electron.EventEmitter,
                                                  progressMessage: ProgressMessage) => {

            const progressBar = ProgressBar.create(false);
            progressBar.update(progressMessage.progress);

        });


    }

}
