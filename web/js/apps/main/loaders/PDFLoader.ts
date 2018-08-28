import {FileLoader} from './FileLoader';
import {WebResource} from '../../../electron/webresource/WebResource';
import {FileRegistry} from '../../../backend/webserver/FileRegistry';
import {AppPaths} from '../../../electron/webresource/AppPaths';
import {LoadedFile} from './LoadedFile';
import {Paths} from '../../../util/Paths';

export class PDFLoader implements FileLoader {

    private readonly fileRegistry: FileRegistry;

    constructor(fileRegistry: FileRegistry) {
        this.fileRegistry = fileRegistry;
    }

    async registerForLoad(path: string): Promise<LoadedFile> {

        let filename = Paths.basename(path);

        let fileMeta = this.fileRegistry.registerFile(path);

        let fileParam = encodeURIComponent(fileMeta.url);
        let filenameParam = encodeURIComponent(filename);

        let appURL = AppPaths.resource(`./pdfviewer/web/viewer.html?file=${fileParam}&filename=${filenameParam}`);

        return {
            webResource: WebResource.createURL(appURL)
        };

    }

}

