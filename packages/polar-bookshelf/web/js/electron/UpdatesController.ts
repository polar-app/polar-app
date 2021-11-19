import {ElectronIpcRenderers} from "polar-electron-framework/src/ElectronIpcRenderers";
import {DesktopAppRuntime} from "polar-electron-framework/src/DesktopAppRuntime";
import {DeterminateProgressBar} from "../ui/progress_bar/DeterminateProgressBar";
import {RestartForUpdateButtons} from "../auto_updates/RestartForUpdateButtons";

interface IProgressInfo {
    readonly percent: number;
}

export class UpdatesController {


    public start(): void {

        if (DesktopAppRuntime.isElectronRenderer()) {

            ElectronIpcRenderers.on('app-update:download-progress', (event: any, progress: IProgressInfo) => {
                this.onProgressInfo(progress);
            });

            ElectronIpcRenderers.on('app-update:update-downloaded', () => {
                this.onUpdateDownloaded();
            });

        }

    }

    private onProgressInfo(progress: IProgressInfo) {

        const percent = Math.floor(progress.percent);

        DeterminateProgressBar.update(percent);

    }

    private onUpdateDownloaded() {
        RestartForUpdateButtons.create();
    }

}
