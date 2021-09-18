import {ContentCaptureContext} from "./ContentCaptureContext";

export namespace ExtensionContextMenus {

    const opts = {
        title: "Save to Polar"
    };

    chrome.contextMenus.create(opts, ContentCaptureContext.handleStartCapture);

}
