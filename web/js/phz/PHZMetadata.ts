import {Browser} from '../capture/Browser';
import {ScrollBox} from '../capture/renderer/Captured';

/**
 * @Deprected use capture/renderer/Captured
 */
export interface PHZMetadata {

    title: string;
    url: string;
    version: string;
    browser: Browser;
    scroll?: ScrollBox;
    scrollBox?: ScrollBox;

    // public constructor(opts: any) {
    //     this.title = Preconditions.assertNotNull(opts.title, "title");
    //     this.url = Preconditions.assertNotNull(opts.url, "url");
    //     this.version = Preconditions.assertNotNull(opts.version, "version");
    //     this.browser = Preconditions.assertNotNull(opts.browser, "browser");
    // }

}
