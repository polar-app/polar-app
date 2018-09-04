/**
 * Create a single browser window by key and just focus if the window is still
 * open the second time we try to open it.
 */
import {BrowserWindow} from 'electron';
import {BrowserWindowRegistry, BrowserWindowTag} from './BrowserWindowRegistry';
import {Logger} from '../../logger/Logger';

const log = Logger.create();

export class SingletonBrowserWindow {

    public static async getInstance(tag: BrowserWindowTag, browserWindowFactory: BrowserWindowFactory) {

        let existing = BrowserWindowRegistry.tagged(tag);

        if(existing.length === 1) {

            log.info("Found existing repository UI. Focusing.");

            let id = existing[0];

            let browserWindow = BrowserWindow.fromId(id);
            browserWindow.focus();
            return browserWindow;
        }

        let result = await browserWindowFactory();

        let tags: {[name: string] : string} = {};
        tags[tag.name] = tag.value;

        BrowserWindowRegistry.tag(result.id, tags);

        return result;

    }

}

export interface BrowserWindowFactory {
    (): Promise<BrowserWindow>
}
