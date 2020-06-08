import {AbstractWebviewWebContentsDriver} from './AbstractWebviewWebContentsDriver';
import {BrowserProfile} from '../BrowserProfile';


export class CaptureWebviewWebContentsDriver extends AbstractWebviewWebContentsDriver {

    constructor(browserProfile: BrowserProfile) {
        super(browserProfile, "./apps/capture-webview/index.html");
    }

}
