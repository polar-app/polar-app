import {ipcRenderer} from "electron";
import {ProgressMessage} from "./ProgressMessage";
import {ProgressMessages} from "./ProgressMessages";
import {ProgressBar} from './ProgressBar';
import {DeterminateProgressBar} from './DeterminateProgressBar';

/**
 *
 */
export class ProgressService {

    public start(): void {

        if (! ipcRenderer) {
            return;
        }

        ipcRenderer.on(ProgressMessages.CHANNEL, (event: Electron.EventEmitter,
                                                  progressMessage: ProgressMessage) => {

            DeterminateProgressBar.update(progressMessage.progress);

        });


    }

}
