import {FileLoader} from './FileLoader';
import {WebResource} from '../../../electron/webresource/WebResource';
import {ResourcePaths} from '../../../electron/webresource/ResourcePaths';
import {LoadedFile} from './LoadedFile';
import {Logger} from 'polar-shared/src/logger/Logger';
import {FileRegistry} from "polar-shared-webserver/src/webserver/FileRegistry";

const log = Logger.create();

export class EPUBLoader extends FileLoader {

    private readonly fileRegistry: FileRegistry;

    constructor(fileRegistry: FileRegistry) {
        super();
        this.fileRegistry = fileRegistry;
    }

    public async registerForLoad(path: string, fingerprint: string): Promise<LoadedFile> {

        const fileMeta = this.fileRegistry.registerFile(path);

        const appURL = EPUBLoader.createViewerURL(fingerprint);

        return {
            webResource: WebResource.createURL(appURL)
        };

    }

    public static createViewerURL(fingerprint: string) {
        return ResourcePaths.resourceURLFromRelativeURL(`/doc/${fingerprint}`, false);
    }

}

