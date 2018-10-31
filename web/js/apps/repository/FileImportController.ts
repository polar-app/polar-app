import {IPersistenceLayer} from "../../datastore/IPersistenceLayer";
import {ipcRenderer} from "electron";
import {Logger} from '../../logger/Logger';
import {FileImportRequest} from "../main/MainAppController";
import {PDFImporter, ImportedFile} from './importers/PDFImporter';
import {ProgressBar} from '../../ui/progress_bar/ProgressBar';
import {Percentages} from '../../util/Percentages';
import {Progress} from "../../util/Progress";
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {IDocInfo} from '../../metadata/DocInfo';
import {Optional} from "../../util/ts/Optional";
import {DocLoader} from '../main/ipc/DocLoader';
import {FilePaths} from "../../util/FilePaths";

const log = Logger.create();

/**
 * Handles performing imports into the datastore when users select files from
 * the import dialog.
 */
export class FileImportController {

    private readonly persistenceLayer: IPersistenceLayer;

    private readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;

    private readonly pdfImporter: PDFImporter;

    constructor(persistenceLayer: IPersistenceLayer, updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>) {
        this.persistenceLayer = persistenceLayer;
        this.updatedDocInfoEventDispatcher = updatedDocInfoEventDispatcher;
        this.pdfImporter = new PDFImporter(persistenceLayer);
    }

    public start(): void {

        log.info("File import controller started");

        ipcRenderer.on('file-import', (event: any, fileImportRequest: FileImportRequest) => {

            this.onFileImportRequest(fileImportRequest)
                .catch(err => log.error("Unable to import: ", err));

        });

    }

    private async onFileImportRequest(fileImportRequest: FileImportRequest) {

        if (fileImportRequest.files.length === 0) {
            // do not attempt an import if no files are given.  This way the
            // progress bar doesn't flash \and then vanish again.
            return;
        }

        const importedFiles = await this.doImportFiles(fileImportRequest.files);

        if (importedFiles.length === 1) {

            const importedFile = importedFiles[0];

            if (importedFile.isPresent()) {

                const file = importedFile.get();
                const fingerprint = file.docInfo.fingerprint;
                const path = file.stashFilePath;

                DocLoader.load({
                       fingerprint,
                       filename: FilePaths.basename(path),
                       newWindow: true
                   }).catch(err => log.error("Unable to load doc: ", err));

            }

        }

    }

    private async doImportFiles(files: string[]): Promise<Array<Optional<ImportedFile>>> {

        const progressBar = ProgressBar.create(false);
        const progress = new Progress(files.length);

        const result: Array<Optional<ImportedFile>> = [];

        try {

            for (const file of files) {

                try {
                    result.push(await this.doImportFile(file));
                } catch (e) {
                    log.error("Failed to import file: " + file, e);
                } finally {
                    progress.incr();
                    progressBar.update(progress.percentage());
                }

            }

            return result;

        } finally {
            progressBar.destroy();
        }

    }

    private async doImportFile(file: string): Promise<Optional<ImportedFile>> {

        log.info("Importing file: " + file);

        const importedFileResult = await this.pdfImporter.importFile(file);

        importedFileResult.map(importedFile => {
            this.updatedDocInfoEventDispatcher.dispatchEvent(importedFile.docInfo);
        });

        return importedFileResult;

    }

}
