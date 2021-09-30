import {CaptureApp} from "./ui/capture/CaptureApp";
import {ExtensionContentCapture} from "./capture/ExtensionContentCapture";

/**
 * Run the content capture functionality.
 */
export namespace ContentCaptureContextEPUB {

    function clearDocument() {
        // clear the document so that we can render to it directly.

        const title = document.title;

        document.documentElement.innerHTML = `<html><head><title>${title}</title></head><body></body></html>`;

    }

    export function handleStartCaptureWithEPUB() {

        const capture = ExtensionContentCapture.capture();

        console.log("Captured: ", capture);

        clearDocument();

        CaptureApp.start(capture);

    }

}
