import {FileLoader} from './FileLoader';
import {WebResource} from '../../../electron/webresource/WebResource';
import {ResourcePaths} from '../../../electron/webresource/ResourcePaths';
import {LoadedFile} from './LoadedFile';
import {FileRegistry} from "polar-shared-webserver/src/webserver/FileRegistry";

export class EPUBLoader extends FileLoader {

    private readonly fileRegistry: FileRegistry;

    constructor(fileRegistry: FileRegistry) {
        super();
        this.fileRegistry = fileRegistry;
    }

    public async registerForLoad(path: string, fingerprint: string): Promise<LoadedFile> {

        const appURL = EPUBLoader.createViewerURL(fingerprint);

        return {
            webResource: WebResource.createURL(appURL)
        };

    }

    public static createViewerURL(fingerprint: string) {
        return ResourcePaths.resourceURLFromRelativeURL(`/doc/${fingerprint}`, false);
    }

}

