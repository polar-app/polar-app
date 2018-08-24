import {FileLoader} from './FileLoader';
import {WebResource} from '../../electron/webresource/WebResource';
import {FileRegistry} from '../../backend/webserver/FileRegistry';
import {AppPaths} from '../../electron/webresource/AppPaths';
import {LoadedFile} from './LoadedFile';

export class PDFLoader implements FileLoader {

    private readonly fileRegistry: FileRegistry;

    constructor(fileRegistry: FileRegistry) {
        this.fileRegistry = fileRegistry;
    }

    async registerForLoad(path: string): Promise<LoadedFile> {

        let fileMeta = this.fileRegistry.registerFile(path);

        let fileParam = encodeURIComponent(fileMeta.url);

        let appURL = AppPaths.resource(`./pdfviewer/web/viewer.html?file=${fileParam}`);

        return {
            webResource: WebResource.createURL(appURL)
        };

    }

}

