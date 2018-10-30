import {IPersistenceLayer} from "../../datastore/IPersistenceLayer";
import {ipcRenderer} from "electron";
import {Logger} from '../../logger/Logger';
import {FileImportRequest} from "../main/MainAppController";
import {PDFImporter} from './importers/PDFImporter';
import {ProgressBar} from '../../ui/progress_bar/ProgressBar';
import {Percentages} from '../../util/Percentages';
import {Progress} from "../../util/Progress";

const log = Logger.create();

/**
 * Handles performing imports into the datastore when users select files from
 * the import dialog.
 */
export class FileImportController {

    private readonly persistenceLayer: IPersistenceLayer;

    private readonly pdfImporter: PDFImporter;

    constructor(persistenceLayer: IPersistenceLayer) {
        this.persistenceLayer = persistenceLayer;
        this.pdfImporter = new PDFImporter(persistenceLayer);
    }

    public start(): void {

        log.info("File import controller started");

        ipcRenderer.on('file-import', (event: any, fileImportRequest: FileImportRequest) => {
            this.onFileImportRequest(fileImportRequest);
        });

    }

    private onFileImportRequest(fileImportRequest: FileImportRequest): void {

        if (fileImportRequest.files.length === 0) {
            // do not attempt an import if no files are given.  This way the
            // progress bar doesn't flash \and then vanish again.
            return;
        }

        const progressBar = ProgressBar.create(false);

        try {

            const progress = new Progress(fileImportRequest.files.length);
            for (const file of fileImportRequest.files) {

                log.info("Importing file: " + file);

                this.pdfImporter.importFile(file);
                progress.incr();

                progressBar.update(progress.percentage());

            }

        } finally {
            progressBar.destroy();
        }

    }

}
