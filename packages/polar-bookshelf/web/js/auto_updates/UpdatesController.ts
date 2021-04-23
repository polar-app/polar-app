import {Logger} from "polar-shared/src/logger/Logger";
import {ProgressInfo} from "builder-util-runtime";
import {ipcRenderer} from 'electron';
import {DeterminateProgressBar} from "../ui/progress_bar/DeterminateProgressBar";
import {RestartForUpdateButtons} from './RestartForUpdateButtons';

const log = Logger.create();

export class UpdatesController {

    public start(): void {

        if (ipcRenderer) {

            ipcRenderer.on('app-update:download-progress', (event: any, progress: ProgressInfo) => {
                this.onProgressInfo(progress);
            });

            ipcRenderer.on('app-update:update-downloaded', () => {
                this.onUpdateDownloaded();
            });

        }

    }

    private onProgressInfo(progress: ProgressInfo) {

        const percent = Math.floor(progress.percent);

        DeterminateProgressBar.update(percent);

    }

    private onUpdateDownloaded() {
        RestartForUpdateButtons.create();
    }

}
