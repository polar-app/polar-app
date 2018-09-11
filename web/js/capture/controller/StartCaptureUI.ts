import {ipcRenderer} from 'electron';
import {Logger} from '../../logger/Logger';

const log = Logger.create();

/**
 * @renderer
 */
export class StartCaptureUI {

    constructor() {
        console.log("Ready to start capture...xxx");

    }

    public init() {

        // wire up the event listeners...

        const form = <HTMLFormElement> document.getElementById("url-form");
        form.onsubmit = () => this.onSubmit();

    }

    public onSubmit() {

        try {

            const urlElement = <HTMLInputElement> document.getElementById("url")!;
            const url = urlElement.value;

            this.requestStartCapture({
                url
            });

        } catch (e) {
            console.error(e);
        }

        return false;

    }

    /**
     * Send a message to the main process to start the capture for us.
     *
     */
    public requestStartCapture(message: StartCaptureMessage) {

        log.info("Sending message to start capture: ", message);
        ipcRenderer.send('capture-controller-start-capture', message);

    }

}

export interface StartCaptureMessage {
    readonly url: string;
}
