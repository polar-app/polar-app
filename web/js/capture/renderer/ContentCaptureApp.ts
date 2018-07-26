import {ContentCaptureController} from "./ContentCaptureController";

export class ContentCaptureApp {

    start() {

        console.log("Starting content capture app...");

        let contentCaptureController = new ContentCaptureController();
        contentCaptureController.start();

    }

}
