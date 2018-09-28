import {FileLoader} from './FileLoader';
import {FileTypes} from './FileTypes';
import {GA} from '../../../ga/GA';
import {LoadedFile} from './LoadedFile';

export class AnalyticsFileLoader implements FileLoader {

    private readonly userAgent: string;

    private readonly delegate: FileLoader;

    constructor(userAgent: string, delegate: FileLoader) {
        this.userAgent = userAgent;
        this.delegate = delegate;
    }

    public registerForLoad(path: string): Promise<LoadedFile> {

        const appAnalytics = GA.getAppAnalytics(this.userAgent);

        const fileType = FileTypes.create(path);

        appAnalytics.screen(`${fileType}viewer`);

        return this.delegate.registerForLoad(path);

    }

}
