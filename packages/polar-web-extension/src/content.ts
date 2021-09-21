import {ContentCaptureContext} from "./ContentCaptureContext";
import {Karma} from "./Karma";

if (! Karma.isKarma()) {
    ContentCaptureContext.handleStartCapture();
    console.log("Started capture")
}
