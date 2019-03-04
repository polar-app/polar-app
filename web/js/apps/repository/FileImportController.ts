import {PersistenceLayer} from "../../datastore/PersistenceLayer";
import {ipcRenderer} from "electron";
import {Logger} from '../../logger/Logger';
import {ImportedFile, PDFImporter} from './importers/PDFImporter';
import {ProgressCalculator} from "../../util/ProgressCalculator";
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {IDocInfo} from '../../metadata/DocInfo';
import {Optional} from "../../util/ts/Optional";
import {FilePaths} from "../../util/FilePaths";
import {isPresent} from "../../Preconditions";
import {Toaster} from "../../ui/toaster/Toaster";
import {IProvider} from "../../util/Providers";
import {DeterminateProgressBar} from '../../ui/progress_bar/DeterminateProgressBar';
import {DocLoader} from "../main/doc_loaders/DocLoader";
import {FileRef} from "../../datastore/Datastore";
import {Blackout} from "../../ui/blackout/Blackout";
import {FileImportRequest} from "./FileImportRequest";
import {AddFileRequest} from "./AddFileRequest";
import {AppRuntime} from "../../AppRuntime";
import {PathStr} from '../../util/Strings';
import {Files, Aborters} from "../../util/Files";
import {ProgressToasters} from '../../ui/progress_toaster/ProgressToasters';
import {AddFileRequests} from "./AddFileRequests";

const log = Logger.create();

/**
 * Handles performing imports into the datastore when users select files from
 * the import dialog.
 *
 * @ElectronRendererContext
 */
export class FileImportController {

    private readonly persistenceLayerProvider: IProvider<PersistenceLayer>;

    private readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;

    private readonly pdfImporter: PDFImporter;

    private readonly docLoader: DocLoader;

    constructor(persistenceLayerProvider: IProvider<PersistenceLayer>,
                updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>) {

        this.persistenceLayerProvider = persistenceLayerProvider;
        this.updatedDocInfoEventDispatcher = updatedDocInfoEventDispatcher;
        this.pdfImporter = new PDFImporter(persistenceLayerProvider);
        this.docLoader = new DocLoader(persistenceLayerProvider);

    }

    public start(): void {

        if (ipcRenderer) {

            ipcRenderer.on('file-import', (event: any, fileImportRequest: FileImportRequest) => {

                this.onFileImportRequest(fileImportRequest)
                    .catch(err => log.error("Unable to import: ", err));

            });

        }

        this.handleBlackout();
        this.handleDragAndDropFiles();

        log.info("File import controller started");

    }

    private handleDragAndDropFiles() {

        document.body.addEventListener('dragenter', (event) => this.onDragEnterOrOver(event), false);
        document.body.addEventListener('dragover', (event) => this.onDragEnterOrOver(event), false);

        document.body.addEventListener('drop', event => this.onDrop(event));

    }

    private handleBlackout() {

        // https://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element

        let depth = 0;

        document.body.addEventListener('dragenter', () => {

            if (depth === 0) {
                Blackout.enable();
            }

            ++depth;

        });

        const leaveOrDropHandler = () => {
            --depth;

            if (depth === 0) {
                Blackout.disable();
            }

        };

        document.body.addEventListener('dragleave', leaveOrDropHandler);
        document.body.addEventListener('drop', leaveOrDropHandler);

    }


    private onDragEnterOrOver(event: DragEvent) {
        event.preventDefault();
    }

    private onDrop(event: DragEvent) {

        event.preventDefault();

        Blackout.disable();

        this.handleDrop(event)
            .catch(err => log.error("Unable to import: ", err));

    }

    private async handleDrop(event: DragEvent) {

        // we have to do three main things here:

        if (event.dataTransfer) {

            const filesDirectly = AddFileRequests.computeDirectly(event);

            const filesRecursively = await AddFileRequests.computeRecursively(event);

            const files = [...filesDirectly, ...filesRecursively.getOrElse([])];

            if (files.length > 0) {

                try {
                    await this.onImportFiles(files);
                } catch (e) {
                    log.error("Unable to import files: ", files, e);
                }

            } else {
                Toaster.error("Unable to upload files.  Only PDF uploads are supported.");
            }

        }

    }

    private async onFileImportRequest(fileImportRequest: FileImportRequest) {

        if (! isPresent(fileImportRequest.files) || fileImportRequest.files.length === 0) {
            // do not attempt an import if no files are given.  This way the
            // progress bar doesn't flash and then vanish again.
            return;
        }

        await this.onImportFiles(fileImportRequest.files);

    }

    private async onImportFiles(files: AddFileRequest[]) {

        const importedFiles = await this.doImportFiles(files);

        if (importedFiles.length === 0) {
            // nothing to do here...
            return;
        }

        if (AppRuntime.isElectron() && importedFiles.length === 1) {

            // only automatically open the file within Electron as that's the
            // only platform that's really fast enough.

            const importedFile = importedFiles[0];

            if (importedFile.isPresent()) {

                const file = importedFile.get();
                const fingerprint = file.docInfo.fingerprint;
                const path = file.stashFilePath;

                // TODO we should ideally have the hashcode built here.
                const fileRef: FileRef = {
                    name: FilePaths.basename(path)
                };

                // TODO(webapp): DO NOT enable this in the web UI... the upload
                // could take forever.  It might be nice to open a tab showing
                // the upload progress and then load the file once it's
                // uploaded.
                this.docLoader.create({
                    fingerprint,
                    fileRef,
                    newWindow: true
                }).load()
                  .catch(err => log.error("Unable to load doc: ", err));

            }

        } else {
            Toaster.success(`Imported ${files.length} files successfully.`);
        }

    }

    private async doImportFiles(files: AddFileRequest[]): Promise<Array<Optional<ImportedFile>>> {

        const progress = new ProgressCalculator(files.length);

        const result: Array<Optional<ImportedFile>> = [];

        try {

            for (const file of files) {

                try {
                    const importedFile = await this.doImportFile(file);
                    result.push(importedFile);
                } catch (e) {
                    log.error("Failed to import file: " + file, e);
                } finally {
                    progress.incr();

                    DeterminateProgressBar.update(progress.percentage());

                }

            }

            return result;

        } finally {
            // noop
        }

    }

    private async doImportFile(file: AddFileRequest): Promise<Optional<ImportedFile>> {

        log.info("Importing file: " + file);

        const importedFileResult =
            await this.pdfImporter.importFile(file.docPath, file.basename);

        importedFileResult.map(importedFile => {
            this.updatedDocInfoEventDispatcher.dispatchEvent(importedFile.docInfo);
        });

        return importedFileResult;

    }

}

