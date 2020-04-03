import {ProgressBar} from '../../ui/progress_bar/ProgressBar';

export class CaptureWebviewApp {

    private progressBar?: ProgressBar;

    public start() {
        this.progressBar = ProgressBar.create();
    }

}
