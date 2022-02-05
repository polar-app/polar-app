import {UAParser} from "ua-parser-js";

export namespace Browsers {

    export function get(): Browser | undefined {
        const parser = new UAParser();
        const result = parser.getResult();


        const name = result.browser.name?.toLocaleLowerCase();

        if (name && ['chrome', 'chromium', 'safari', 'firefox'].includes(name)) {

            const browser = {
                id: name,
                version: result.browser.version!
            };

            return <Browser> browser;

        }

        return undefined;

    }

    export function when(whitelist: ReadonlyArray<BrowserID>, callback: () => void) {

        const browser = get();

        if (browser && whitelist.includes(browser.id)) {
            callback();
        } else {
            console.warn("Unable to execute for browser: " + browser?.id);
        }

    }

    export function raw(): RawBrowser {
        const parser = new UAParser();
        return parser.getResult();
    }

}

export interface RawBrowser extends IUAParser.IResult {

}

export interface Browser {
    readonly id: BrowserID;
    readonly version: string;
}

export type BrowserID = 'chrome' | 'chromium' | 'firefox' | 'safari';
