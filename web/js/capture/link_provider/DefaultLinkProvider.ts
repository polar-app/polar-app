import {LinkProvider} from './LinkProvider';
import {BrowserProfileID} from '../BrowserProfile';

/**
 * Basic LinkProvider that's already satisfied externally.
 */
export class DefaultLinkProvider implements LinkProvider {

    private readonly link: string;

    constructor(link: string) {
        this.link = link;
    }

    public get(browserProfileID: BrowserProfileID): Promise<string> {
        return Promise.resolve(this.link);
    }

}
