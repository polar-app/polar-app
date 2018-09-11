import {AbstractWebviewWebContentsDriver} from './AbstractWebviewWebContentsDriver';
import {BrowserProfile} from '../BrowserProfile';
import {MainIPCEvent} from '../../electron/framework/IPCMainPromises';
import {WebContentsNotifier} from '../../electron/web_contents_notifier/WebContentsNotifier';
import {BrowserAppEvents} from '../../apps/browser/BrowserAppEvents';
import {Logger} from '../../logger/Logger';
import {TriggerCaptureMessage} from '../../apps/browser/TriggerCaptureMessage';

const log = Logger.create();

export class BrowserWebContentsDriver extends AbstractWebviewWebContentsDriver {

    private loadedInitialURL: boolean = false;

    constructor(browserProfile: BrowserProfile) {
        super(browserProfile, "./apps/browser/index.html");
    }

    public async loadURL(url: string, waitForFinishLoad: boolean = true): Promise<void> {

        if (! this.loadedInitialURL) {

            super.loadURL(url, false)
                .catch(err => log.error("Could not load URL: ", err));

            this.loadedInitialURL = true;

            const triggerCapturePromise: Promise<MainIPCEvent<TriggerCaptureMessage>>
                = WebContentsNotifier.once(this.getBrowserWindow()!.webContents, BrowserAppEvents.TRIGGER_CAPTURE);

            await triggerCapturePromise;

        } else {
            return super.loadURL(url);
        }

    }

}
