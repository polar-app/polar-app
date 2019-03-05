import {ipcRenderer} from "electron";
import {ProgressMessage} from "./ProgressMessage";
import {ProgressMessages} from "./ProgressMessages";
import {ProgressBar} from './ProgressBar';
import {DeterminateProgressBar} from './DeterminateProgressBar';
import {Logger} from '../../logger/Logger';

const log = Logger.create();

/**
 *
 */
export class ProgressService {

    public start(): void {

        if (ipcRenderer) {

            ipcRenderer.on(ProgressMessages.CHANNEL, (event: Electron.EventEmitter,
                                                      progressMessage: ProgressMessage) => {

                DeterminateProgressBar.update(progressMessage.progress);

            });

        }

        log.info("started");

    }

}
