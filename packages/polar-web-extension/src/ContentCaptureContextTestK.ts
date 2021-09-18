import {ContentCaptureContext} from "./ContentCaptureContext";
import {ContentCaptureContextEPUB} from "./ContentCaptureContextEPUB";

describe("ContentCaptureContext", function() {

    it("load page", () => {

        document.body.innerHTML = 'hello world';
        ContentCaptureContextEPUB.handleStartCaptureWithEPUB();

    });

})
