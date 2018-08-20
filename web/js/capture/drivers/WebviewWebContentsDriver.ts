import {webContents} from 'electron';
import {Logger} from '../../logger/Logger';
import {StandardWebContentsDriver} from './StandardWebContentsDriver';
import {AppPaths} from '../../electron/webresource/AppPaths';
import {notNull} from '../../Preconditions';
import {Promises} from '../../util/Promises';
import WebContents = Electron.WebContents;

const log = Logger.create();

/**
 * A driver which creates an app that uses a <webview> host control for our
 * content.
 */
export class WebviewWebContentsDriver extends StandardWebContentsDriver {

    public async init() {

        await super.init();

        // ok... now the page isn't setup properly and we need to load the app
        // and then adjust the webview properly.

        let resourceURL = AppPaths.resource("./apps/capture-webview/index.html");
        let blankURL = AppPaths.resource("./apps/capture-webview/blank.html");

        // FIXME: we're not loading the webview...
        notNull(this.window).loadURL(resourceURL);

        this.webContents = await this.waitForWebview();

    }

    public async waitForWebview(): Promise<WebContents> {
        return new Promise<WebContents>(resolve => {
            this.window!.webContents.once('did-attach-webview', (event, webContents: WebContents) => {
                resolve(webContents);
            });
        });
    }

}
