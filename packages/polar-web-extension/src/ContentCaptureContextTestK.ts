import {ContentCaptureContext} from "./ContentCaptureContext";
import {ContentCaptureContextEPUB} from "./ContentCaptureContextEPUB";

// eslint-disable-next-line no-var
declare var chrome: any;
// eslint-disable-next-line no-var
declare var window: any;

window.chrome = {
    runtime: {
        onMessage: {
            addListener: () => console.log('addListener called'),
            removeListener: () => console.log('removeListener called')
        }
    }
}


describe("ContentCaptureContext", function() {

    it("load page", () => {

        document.body.innerHTML = 'hello world';
        ContentCaptureContextEPUB.handleStartCaptureWithEPUB();

        // at this point we just have the react content rendered with a button.

        // TODO: click the button or do what the button does directly

    });

})


