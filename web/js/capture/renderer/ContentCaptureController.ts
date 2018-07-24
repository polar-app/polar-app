import {ContentCapture} from './ContentCapture';
import {Logger} from '../../logger/Logger';

const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;

const log = Logger.create();

/**
 * Controller that intercepts events from the main Electron process, triggers
 * a capture, then returns the results to the caller via a message response.
 */
export class ContentCaptureController {

    /**
     * Start the content capture system which involves listening to IPC messages
     * for triggering rendering.
     */
    start(): void {

        log.info("IPC listener added for content-capture at: " + new Date().toISOString());

        ipcRenderer.on('content-capture', (event: any, data: any) => {

            if(data.type ===  "request") {
                this.onContentCaptureRequest();
            }

        });

        ipcRenderer.send("content-capture", {type: "content-capture-controller-started"});

    }

    onContentCaptureRequest() {

        log.info("Received content capture request.");

        let captured = ContentCapture.captureHTML();

        log.info("Sending response");

        ipcRenderer.send("content-capture", {
            type: "response",
            captured
        });

    }

}
