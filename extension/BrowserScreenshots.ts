import {Toaster} from '../web/js/ui/toaster/Toaster';

export class BrowserScreenshots {

    public static capture() {

        // if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
        //
        //     for (const extensionID of extensionIDs) {
        //
        //         const responseCallback = (message: any) => {
        //
        //             if (message) {
        //
        //                 if (message.success !== undefined) {
        //
        //                     if (message.success) {
        //                         Toaster.success("Successfully imported into Polar Desktop");
        //                     } else {
        //                         Toaster.error("Failed to import into Polar Desktop: " + message.message);
        //                     }
        //
        //                 }
        //
        //             } else {
        //                 // we don't always get a callback and it will be null
        //                 // when nothing saw the message if the extension isn't
        //                 // present.
        //             }
        //
        //         };
        //
        //         chrome.runtime.sendMessage(extensionID, message, responseCallback);
        //
        //     }
        //
        // }

    }

}
