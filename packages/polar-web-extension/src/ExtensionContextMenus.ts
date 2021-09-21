import {ContentCaptureContext} from "./ContentCaptureContext";
import {Karma} from "./Karma";

export namespace ExtensionContextMenus {

    if (! Karma.isKarma()) {

        const opts = {
            title: "Save to Polar"
        };

        chrome.contextMenus.create(opts, ContentCaptureContext.handleStartCapture);
    }

}
