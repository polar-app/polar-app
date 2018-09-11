import {StartCaptureUI} from './StartCaptureUI';

export class StartCaptureApp {

    public start() {

        const startCaptureUI = new StartCaptureUI();
        startCaptureUI.init();

        console.log("Ready to start capture..." + startCaptureUI);

    }

}
