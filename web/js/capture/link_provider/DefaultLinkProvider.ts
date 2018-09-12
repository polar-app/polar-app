import {LinkProvider} from './LinkProvider';

/**
 * Basic LinkProvider that's already satisfied externally.
 */
export class DefaultLinkProvider implements LinkProvider {

    private readonly link: string;

    constructor(link: string) {
        this.link = link;
    }

    public get(): Promise<string> {
        return Promise.resolve(this.link);
    }

}
