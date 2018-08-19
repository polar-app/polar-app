import {Browser} from '../capture/Browser';

export interface PHZMetadata {

    title: string;
    url: string;
    version: string;
    browser: Browser;
    scroll: Scroll;

    // public constructor(opts: any) {
    //     this.title = Preconditions.assertNotNull(opts.title, "title");
    //     this.url = Preconditions.assertNotNull(opts.url, "url");
    //     this.version = Preconditions.assertNotNull(opts.version, "version");
    //     this.browser = Preconditions.assertNotNull(opts.browser, "browser");
    // }

}

interface Scroll {

    width: number;
    height: number;

}
