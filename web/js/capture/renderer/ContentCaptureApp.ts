import {ContentCaptureController} from "./ContentCaptureController";

export class ContentCaptureApp {

    start() {

        console.log("Starting content capture app...");

        let contentCaptureController = new ContentCaptureController();
        contentCaptureController.start();

    }

}

// FIXME: I don't like this ... I need to have it start automatically so that
// I can make it the entry point but at the same time I don't want it to start
// just because I imported it.
new ContentCaptureApp().start();
