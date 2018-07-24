import {ContentCaptureController} from "./ContentCaptureController";


class ContentCaptureApp {

    static start() {

        console.log("Starting content capture app...");

        let contentCaptureController = new ContentCaptureController();
        contentCaptureController.start();

    }

}

ContentCaptureApp.start();
