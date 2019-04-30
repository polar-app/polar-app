import {InitialSplash} from './InitialSplash';
import {ImportContentHandler} from './ImportContentHandler';

// Load the Polar webapp after install which will send to login if not
// authenticated first and also give the user the option to download.

InitialSplash.register();
ImportContentHandler.register();

// used to determine if the extension is installed.
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {

    const isHandled = (): boolean => {
        return message && message.type && message.type === 'polar-extension-ping';
    };

    if (isHandled()) {
        sendResponse({pong: true});
    }

});


