
export class StartCaptureApp {

    public start() {

        const {StartCaptureUI} = require("./StartCaptureUI");

        const startCaptureUI = new StartCaptureUI();
        startCaptureUI.init();

        console.log("Ready to start capture..." + startCaptureUI);

    }

}
