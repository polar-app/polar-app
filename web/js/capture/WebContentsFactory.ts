/**
 * Provides a simple way for us to get the WebContents to work with when capturing
 * a page.  This way we can use a real window, a webview, iframe, etc and not
 * provide the right WebContents to work with.
 */
import {WebContentsReference} from './WebContentsReference';

export interface WebContentsFactory {

    create(url: string, options: any): WebContentsReference;

}
