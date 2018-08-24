import {FileLoader} from './FileLoader';
import {WebResource} from '../../electron/webresource/WebResource';

export class AnalyticsFileLoader implements FileLoader {

    private readonly delegate: FileLoader;

    constructor(userAgent: string, delegate: FileLoader) {
        this.delegate = delegate;
    }

    registerForLoad(path: string): Promise<WebResource> {
        return this.delegate.registerForLoad(path);
    }

}
