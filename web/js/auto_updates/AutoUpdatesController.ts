import {Logger} from "../logger/Logger";
import {ProgressInfo} from "builder-util-runtime";
import electron, {ipcRenderer} from 'electron';
import {ProgressBar} from "../ui/progress_bar/ProgressBar";

const log = Logger.create();

export class AutoUpdatesController {

    private progressBar?: ProgressBar;

    constructor() {
    }

    public start(): void {

        ipcRenderer.on('download-progress', (event: any, progress: ProgressInfo) => {
            this.onProgressInfo(progress);
        });

    }

    private onProgressInfo(progress: ProgressInfo) {

        if (!this.progressBar) {
            this.progressBar = ProgressBar.create(false);
        }

        const percent = Math.floor(progress.percent);

        this.progressBar.update(percent);

        if (percent >= 100) {
            this.progressBar.destroy();
            this.progressBar = undefined;
        }

    }

}
