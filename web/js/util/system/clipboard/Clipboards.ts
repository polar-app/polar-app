import {Clipboard} from './Clipboard';
import {BrowserClipboard} from './providers/BrowserClipboard';


export class Clipboards {

    public static getInstance(): Clipboard {
        // we only use the Browser clipboard as we do not need to use anything
        // custom with electron
        return new BrowserClipboard();
    }

}

