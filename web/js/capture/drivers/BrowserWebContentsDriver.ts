import {AbstractWebviewWebContentsDriver} from './AbstractWebviewWebContentsDriver';
import {BrowserProfile} from '../BrowserProfile';


export class BrowserWebContentsDriver extends AbstractWebviewWebContentsDriver {

    constructor(browserProfile: BrowserProfile) {
        super(browserProfile, "./apps/browser/index.html");
    }

}
