import {FileLoader} from './FileLoader';
import {WebResource} from '../../../electron/webresource/WebResource';
import {FileRegistry} from '../../../backend/webserver/FileRegistry';
import {AppPaths} from '../../../electron/webresource/AppPaths';
import {LoadedFile} from './LoadedFile';
import {Directories} from '../../../datastore/Directories';
import {Files} from '../../../util/Files';
import {Logger} from '../../../logger/Logger';
import {FilePaths} from '../../../util/FilePaths';

const log = Logger.create();

export class PDFLoader implements FileLoader {

    private readonly fileRegistry: FileRegistry;

    constructor(fileRegistry: FileRegistry) {
        this.fileRegistry = fileRegistry;
    }

    async registerForLoad(path: string): Promise<LoadedFile> {

        path = await this.importToStore(path);

        let filename = FilePaths.basename(path);

        let fileMeta = this.fileRegistry.registerFile(path);

        let fileParam = encodeURIComponent(fileMeta.url);
        let filenameParam = encodeURIComponent(filename);

        let appURL = AppPaths.resource(`./pdfviewer/web/viewer.html?file=${fileParam}&filename=${filenameParam}`);

        return {
            webResource: WebResource.createURL(appURL)
        };

    }

    /**
     * Import a PDF file to the store if it's not already in the store so that
     * it opens for the next time.
     *
     * @param path
     */
    private async importToStore(path: string) {

        let currentDirname = await Files.realpathAsync(FilePaths.dirname(path));

        let directories = new Directories();

        let stashDir = await Files.realpathAsync(directories.stashDir);

        if(currentDirname != stashDir) {
            let fileName = FilePaths.basename(path);

            let newPath = FilePaths.join(stashDir, fileName);

            path = await Files.realpathAsync(path);

            log.info(`Importing PDF file from ${path} to ${newPath}`);


            await Files.copyFileAsync(path, newPath);
            return newPath;
        }

        return path;

    }

}

