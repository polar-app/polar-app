import {DeterminateProgressBar} from "../ui/progress_bar/DeterminateProgressBar";
import {RestartForUpdateButtons} from "../auto_updates/RestartForUpdateButtons";

interface IProgressInfo {
    readonly percent: number;
}

/**
 * @deprecated
 */
export class UpdatesController {


    public start(): void {

    }

    private onProgressInfo(progress: IProgressInfo) {

        const percent = Math.floor(progress.percent);

        DeterminateProgressBar.update(percent);

    }

    private onUpdateDownloaded() {
        RestartForUpdateButtons.create();
    }

}
