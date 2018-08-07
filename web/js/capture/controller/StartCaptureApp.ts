
export class StartCaptureApp {

    start() {

        const {StartCaptureUI} = require("./StartCaptureUI");

        let startCaptureUI = new StartCaptureUI();
        startCaptureUI.init();

        console.log("Ready to start capture..." + startCaptureUI);

    }

}
