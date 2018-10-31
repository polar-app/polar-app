import {IPersistenceLayer} from "../../datastore/IPersistenceLayer";
import {ipcRenderer} from "electron";
import {Logger} from '../../logger/Logger';
import {FileImportRequest} from "../main/MainAppController";
import {PDFImporter} from './importers/PDFImporter';
import {ProgressBar} from '../../ui/progress_bar/ProgressBar';
import {Percentages} from '../../util/Percentages';
import {Progress} from "../../util/Progress";
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {IDocInfo} from '../../metadata/DocInfo';

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

        const progressBar = ProgressBar.create(false);
        const progress = new Progress(fileImportRequest.files.length);

        try {

            for (const file of fileImportRequest.files) {

                try {

                    log.info("Importing file: " + file);

                    // TODO: it might be that we can't properly pass
                    const importedFile = await this.pdfImporter.importFile(file);

                    importedFile.map(docInfo => {
                        this.updatedDocInfoEventDispatcher.dispatchEvent(docInfo);
                    });

                } catch (e) {
                    log.error("Failed to import file: " + file, e);
                } finally {
                    progress.incr();
                    progressBar.update(progress.percentage());
                }

            }

        } finally {
            progressBar.destroy();
        }

    }

}
