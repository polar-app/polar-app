import {LinkProvider} from './LinkProvider';
import {BrowserProfileID} from '../BrowserProfile';

/**
 * Basic LinkProvider that's already satisfied externally.
 */
export class ResolveableLinkProvider implements LinkProvider {

    private promise: Promise<string>;

    private resolve: (value: string) => void = () => {};

    constructor() {
        this.promise = new Promise<string>(resolve => {
            this.resolve = resolve;
        });
    }

    public async get(browserProfileID: BrowserProfileID): Promise<string> {
        return this.promise;
    }

    public set(value: string) {
        this.resolve(value);
    }

}
