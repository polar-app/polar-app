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

        const existing = BrowserWindowRegistry.tagged(tag);

        if (existing.length === 1) {

            log.info("Found existing repository UI. Focusing.");

            const id = existing[0];

            const browserWindow = BrowserWindow.fromId(id);
            browserWindow.focus();
            return browserWindow;

        }

        const result = await browserWindowFactory();

        const tags: {[name: string]: string} = {};
        tags[tag.name] = tag.value;

        BrowserWindowRegistry.tag(result.id, tags);

        return result;

    }

}

export type BrowserWindowFactory = () => Promise<BrowserWindow>;
