console.log("FIXME 111");

import {FileLoader} from './FileLoader';
import {WebResource} from '../../../electron/webresource/WebResource';
import {ResourcePaths} from '../../../electron/webresource/ResourcePaths';
import {LoadedFile} from './LoadedFile';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {FileRegistry} from "polar-shared-webserver/src/webserver/FileRegistry";
import {PDFMetadata} from "polar-pdf/src/pdf/PDFMetadata";

const NEW_VIEWER_ENABLED = true;

export class PDFLoader extends FileLoader {

    private readonly fileRegistry: FileRegistry;

    constructor(fileRegistry: FileRegistry) {
        super();
        this.fileRegistry = fileRegistry;
    }

    public async registerForLoad(path: string): Promise<LoadedFile> {

        const pdfMetadata = await PDFMetadata.getMetadata(path);
        const fingerprint = pdfMetadata.fingerprint;
        const filename = FilePaths.basename(path);

        const fileMeta = this.fileRegistry.registerFile(path);

        const appURL = PDFLoader.createViewerURL(fingerprint, fileMeta.url, filename);

        return {
            webResource: WebResource.createURL(appURL)
        };

    }

    public static createViewerURL(fingerprint: string,
                                  fileURL: string,
                                  filename: string) {

        const fileParam = encodeURIComponent(fileURL);
        const filenameParam = encodeURIComponent(filename);

        if (NEW_VIEWER_ENABLED) {
            return ResourcePaths.resourceURLFromRelativeURL(`/pdf/${fingerprint}`, false);
        } else {
            return ResourcePaths.resourceURLFromRelativeURL(`/pdfviewer/web/index.html?file=${fileParam}&filename=${filenameParam}&zoom=page-width`, false);
        }

    }

}

