const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;

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

        console.log("IPC listener added for create-annotation");

        ipcRenderer.on('content-capture', (event, data) => {

            if(data.type ===  "request") {
                this.onContentCaptureRequest();
            }

        });

    }

    onContentCaptureRequest() {

        console.log("Received content capture request.");

        let captured = ContentCapture.captureHTML();

        ipcRenderer.send("content-capture", {
            type: "response",
            captured
        });

    }

}
