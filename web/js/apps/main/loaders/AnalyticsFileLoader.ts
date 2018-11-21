import {FileLoader} from './FileLoader';
import {FileTypes} from './FileTypes';
import {GA} from '../../../ga/GA';
import {LoadedFile} from './LoadedFile';

export class AnalyticsFileLoader extends FileLoader {

    private readonly delegate: FileLoader;

    constructor(delegate: FileLoader) {
        super();
        this.delegate = delegate;
    }

    public registerForLoad(path: string): Promise<LoadedFile> {

        const appAnalytics = GA.getAppAnalytics();

        const fileType = FileTypes.create(path);

        appAnalytics.screen(`${fileType}viewer`);

        return this.delegate.registerForLoad(path);

    }

}
